import AlertList from "./AlertList";
export default function Alerts(){
    const alerts = [
    { tipo: "Falla de energía", nodo: "Nodo 1", fecha: "2025-05-15 09:00" },
    { tipo: "Conexión perdida", nodo: "Nodo 2", fecha: "2025-05-15 10:15" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },
    { tipo: "Sobrecalentamiento", nodo: "Nodo 3", fecha: "2025-05-15 11:30" },

  ];
    return(
    <div>
      <AlertList alerts={alerts} />
    </div>
    );
}
