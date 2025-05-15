import React from "react";
export default function AlertComponent({tipo,nodo,fecha}) {
  return (
    <div class="rounded bg-blue-300 w-2/4 h-2/4 flex-auto flex flex-col items-center">
        <h1 class="text-2xl">{tipo}</h1>
        <h2>{nodo}</h2>
        <h3>{fecha}</h3>
    </div>
  );
}

