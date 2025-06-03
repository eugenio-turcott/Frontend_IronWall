import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePdf = async (elementId, fileName) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    return;
  }

  // Crear un contenedor temporal para el reporte con mejor formato
  const reportContainer = document.createElement('div');
  reportContainer.style.position = 'fixed';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '0';
  reportContainer.style.width = '800px';
  reportContainer.style.padding = '20px';
  reportContainer.style.backgroundColor = '#ffffff';

  // Obtener título y fecha del dashboard
  const titleElement = element.querySelector('h1');
  const dateElement = element.querySelector('p.text-gray-500');
  const graphElement = element.querySelector('.z-10'); // Contenedor del gráfico

  // Construir el contenido del reporte
  reportContainer.innerHTML = `
    <div style="margin-bottom: 20px; text-align: center;">
      <h1 style="font-size: 24px; color: #2d3748; margin-bottom: 5px;">
        ${titleElement ? titleElement.textContent : 'Reporte'}
      </h1>
      <p style="color: #718096; font-size: 14px;">
        ${dateElement ? dateElement.textContent : new Date().toLocaleDateString()}
      </p>
    </div>
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      ${graphElement ? graphElement.innerHTML : 'Gráfico no disponible'}
    </div>
    <div style="text-align: right; color: #718096; font-size: 12px;">
      Generado el ${new Date().toLocaleDateString()}
    </div>
  `;

  document.body.appendChild(reportContainer);

  try {
    // Esperar un breve momento para que los gráficos se rendericen
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      logging: true,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // Asegurarse de que los gráficos se rendericen en el clon
        const clonedContainer = clonedDoc.getElementById(reportContainer.id);
        if (clonedContainer) {
          clonedContainer.style.visibility = 'visible';
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error al generar el PDF. Por favor verifica la consola para más detalles.');
  } finally {
    // Limpiar
    document.body.removeChild(reportContainer);
  }
};