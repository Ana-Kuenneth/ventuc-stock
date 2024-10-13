import React, { useState, useEffect, useCallback } from "react";
import useStore from "../store/store";
import { Link } from "react-router-dom";
import TopPages from "./TopPages";
import "../styles/Movimientos.css";

const url = "https://ventuc-stock-back.onrender.com";

function HistoryPage() {
  const movements = useStore((state) => state.movements) || [];
  const setMovements = useStore((state) => state.setMovements);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [filter, setFilter] = useState("todos"); // Estado para el filtro

  const getMovements = useCallback(async () => {
    try {
      const response = await fetch(`${url}/movements`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setMovements(data);
      setFilteredMovements(data); // Inicialmente se muestran todos
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setMovements]);

  useEffect(() => {
    getMovements();
  }, [getMovements]);

  // Manejar el filtro
  useEffect(() => {
    if (filter === "todos") {
      setFilteredMovements(movements);
    } else {
      setFilteredMovements(
        movements.filter((movement) => movement.type === filter)
      );
    }
  }, [filter, movements]);

  return (
    <div>
      <TopPages />

      <nav className="navHistorial">
        <Link to="/historial">
          <button>Volver a todo el historial</button>
        </Link>{" "}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="todos">Todos los movimientos</option>
          <option value="Ingreso de producto">Ingreso de producto nuevo</option>
          <option value="Actualización de Stock">
            Actualizaciones por baja
          </option>
        </select>
      </nav>

      <div className="contenedorMovimientos">
        <h1>Historial de Compras y Actualizaciones</h1>
        <table className="dataTable">
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
            {filteredMovements && filteredMovements.length > 0 ? (
              filteredMovements
                .slice()
                .reverse()
                .map((movement, index) => (
                  <tr key={index}>
                    {/* <td>{filteredMovements.length - index}</td> */}
                    <td>{movement.generalCode}</td>
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
      </div>
    </div>
  );
}

export default HistoryPage;


