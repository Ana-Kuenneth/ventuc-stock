import React, { useEffect, useCallback } from "react";
import useStore from "../store/store";
import { Link } from "react-router-dom";

const url = "https://ventuc-stock-back.onrender.com";

function HistoryPage() {
  const movements = useStore((state) => state.movements) || [];
  const setMovements = useStore((state) => state.setMovements);

  const getMovements = useCallback(async () => {
    try {
      const response = await fetch(`${url}/movements`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setMovements(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setMovements]);

  useEffect(() => {
    getMovements();
  }, [getMovements]);

  return (
    <div>
      <h1>Historial de Compras y Actualizaciones</h1>
      <table>
        <thead>
          <tr>
            <th>Número de Movimiento</th>
            <th>Movimiento</th>
            <th>Código del Producto</th>
            <th>Nombre del Producto</th>
            <th>Fecha</th>
            <th>Stock Anterior</th>
            <th>Stock Actual</th>
            <th>Descripción del Movimiento</th>
          </tr>
        </thead>
        <tbody>
          {movements.length > 0 ? (
            movements
              .slice()
              .reverse()
              .map((movement, index) => (
                <tr key={index}>
                  <td>{movements.length - index}</td>
                  <td>{movement.type}</td>
                  <td>{movement.code}</td>
                  <td>{movement.name}</td>
                  <td>{movement.date}</td>
                  <td>{movement.previousStock}</td>
                  <td>{movement.newStock}</td>
                  <td
                    style={{ color: movement.quantity < 0 ? "red" : "black" }}
                  >
                    {movement.description}
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8">No hay movimientos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Link to="/">
        <button>Volver a la página principal</button>
      </Link>
    </div>
  );
}

export default HistoryPage;
