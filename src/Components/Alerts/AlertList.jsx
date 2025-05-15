import AlertComponent from "./AlertComponent";

export default function AlertList({alerts}){
    return(
        <div>
            <h1>Alerts</h1>
            <div className="overflow-y-scroll h-full rounded p-2 flex flex-col space-y-4">
                {alerts.map((item,index) => (
                    <AlertComponent 
                    key={index}
                    tipo={item.tipo}
                    nodo={item.nodo}
                    fecha={item.fecha}
                    />
                ))}
            </div>
        </div>
    );
}