import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FocusGraph({
  selectedGraph,
  chartComponents,
  onClose,
}) {
  const handleClose = () => {
    // Eliminar el hash de la URL
    window.location.hash = "";
    // Limpiar el selectedGraph en el padre (se hará a través de la prop onClose)
    // También establecer "Panel" como el ítem activo en la sidebar
    sessionStorage.setItem("activeSidebarItem", "Panel");
    onClose();
  };

  if (!selectedGraph) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 mt-4">
        Selecciona una gráfica para ver los detalles.
      </div>
    );
  }
  const Chart = chartComponents[selectedGraph];
  return (
    <div className="flex w-full h-full bg-white rounded-xl shadow mt-4 border relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex items-center justify-center w-1/5 border-r p-4">
        Test
      </div>
      <div className="flex items-center justify-center w-3/5 p-4">{Chart}</div>
      <div className="flex items-center justify-center w-1/5 border-l p-4">
        Test
      </div>
    </div>
  );
}
