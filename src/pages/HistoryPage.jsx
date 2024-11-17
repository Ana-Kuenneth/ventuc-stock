import React, { useEffect, useState, useCallback } from "react";
import useStore from "../store/store";
import { Link } from "react-router-dom";
import TopPages from "../components/TopPages";
import "../styles/Movimientos.css";

const url = "https://ventuc-stock-back.onrender.com";

function HistoryPage() {
  const [combinedData, setCombinedData] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState(""); // Estado para la fecha
  const [sortType, setSortType] = useState(""); // Estado para el tipo de ordenamiento

  const history = useStore((state) => state.history) || [];
  const setHistory = useStore((state) => state.setMovements); // Cambiar a setHistory si has agregado una función para establecer el historial

  // Obtener movimientos y ventas
  const getData = useCallback(async () => {
    try {
      const movementsResponse = await fetch(`${url}/movements`);
      if (!movementsResponse.ok) {
        throw new Error("Error en la solicitud de movimientos");
      }
      const movementsData = await movementsResponse.json();
  
      const salesResponse = await fetch(`${url}/sales`);
      if (!salesResponse.ok) {
        throw new Error("Error en la solicitud de ventas");
      }
      const salesData = await salesResponse.json();
      
      // Establecer ambos en la tienda
      setHistory([...movementsData, ...salesData]);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setHistory]);

  // // Combinar movimientos y ventas
  useEffect(() => {
    if (history.length > 0) {
      const combined = history.map((item) => ({
        generalCode: item.generalCode,
        type: item.type,
        code: item.code,
        productCode: item.code, // Asumiendo que este es el código del producto
        productName: item.name || item.productName, // Ajustar según tus datos
        description: item.description || "Movimiento registrado",
        date: item.date || item.saleDate, // Ajustar según tus datos
      }));

      setCombinedData(combined);
    }
  }, [history]);

  // Obtener datos al montar el componente
  useEffect(() => {
    getData();
  }, [getData]);

  // Filtrar los datos
  const filteredData = combinedData
    .filter((item) => (filter === "todos" ? true : item.type === filter))
    .filter((item) =>
      dateFilter
        ? new Date(item.date).toLocaleDateString() === dateFilter
        : true
    )
    .sort((a, b) => {
      if (sortType === "codigoAsc") {
        return a.code.localeCompare(b.code);
      } else if (sortType === "codigoDesc") {
        return b.code.localeCompare(a.code);
      } else if (sortType === "fechaAsc") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortType === "fechaDesc") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });

  return (
    <div>
      <TopPages />

      <nav className="navHistorial">
        <Link to="/">
          <button>Volver a la página principal</button>
        </Link>
        <Link to="/historial-ventas">
          <button>Detalle Ventas</button>
        </Link>
        <Link to="/historial-movimientos">
          <button>Detalle Compras y Actualizaciones</button>
        </Link>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="todos">Todos los movimientos</option>
          <option value="Venta de producto">Venta de productos</option>
          <option value="Ingreso de producto">Ingreso de producto</option>
          <option value="Actualización de Stock">Actualización de Stock</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="sort-select"
        >
          <option value="fechaAsc">Ordenar</option>
          <option value="codigoAsc">Código Ascendente</option>
          <option value="codigoDesc">Código Descendente</option>
          <option value="fechaAsc">Fecha Ascendente</option>
          <option value="fechaDesc">Fecha Descendente</option>
        </select>
      </nav>

      <h2>Resumen de movimientos</h2>
      <table className="dataTable">
        <thead>
          <tr>
            <th>Número de Movimiento General</th>
            <th>Tipo de Movimiento</th>
            <th>Número de Movimiento</th>
            <th>Código de Producto</th>
            <th>Nombre del Producto</th>
            <th>Fecha</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData
              .slice()
              .reverse()
              .map((item, index) => (
                <tr key={index}>
                  <td>{String(item.generalCode)}</td>
                  <td>{item.type}</td>
                  <td>{item.code}</td>
                  <td>{item.productCode}</td>
                  <td>{item.productName}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.description}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="7">No hay movimientos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryPage;


// import React, { useEffect, useState, useCallback } from "react";
// import useStore from "../store/store";
// import { Link } from "react-router-dom";
// import TopPages from "../components/TopPages";
// import "../styles/Movimientos.css";

// const url = "https://ventuc-stock-back.onrender.com";

// function HistoryPage() {
//   const [combinedData, setCombinedData] = useState([]);
//   const [filter, setFilter] = useState("todos");
//   const [dateFilter, setDateFilter] = useState(""); // Estado para la fecha
//   const [sortType, setSortType] = useState(""); // Estado para el tipo de ordenamiento

//   const movements = useStore((state) => state.movements) || [];
//   const setMovements = useStore((state) => state.setMovements);
//   const { sales, setSales } = useStore();

//   // Obtener movimientos
//   const getMovements = useCallback(async () => {
//     try {
//       const response = await fetch(`${url}/movements`);
//       if (!response.ok) {
//         throw new Error("Error en la solicitud: " + response.status);
//       }
//       const data = await response.json();
//       setMovements(data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [setMovements]);

//   // Obtener ventas
//   const getSales = useCallback(async () => {
//     try {
//       const response = await fetch(`${url}/sales`);
//       if (!response.ok) {
//         throw new Error("Error en la solicitud: " + response.status);
//       }
//       const data = await response.json();
//       setSales(data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, [setSales]);

//   // Combinar movimientos y ventas
//   useEffect(() => {
//     if (movements.length > 0 && sales.length > 0) {
//       const combined = [
//         ...movements.map((movement) => ({
//           generalCode: movement.generalCode,
//           type: movement.type,
//           code: movement.code,
//           productCode: movement.code,
//           productName: movement.name,
//           description: movement.description || "",
//           date: movement.date,
//         })),
//         ...sales.map((sale) => ({
//           generalCode: sale.generalCode,
//           code: sale.code,
//           type: "Venta",
//           productCode: sale.productCode,
//           productName: sale.productName,
//           description: "Venta realizada",
//           date: sale.saleDate,
//         })),
//       ];

//       setCombinedData(combined);
//     }
//   }, [movements, sales]);

//   // Obtener datos al montar el componente
//   useEffect(() => {
//     getMovements();
//     getSales();
//   }, [getMovements, getSales]);

//   // Filtrar los datos
//   const filteredData = combinedData
//     .filter((item) => (filter === "todos" ? true : item.type === filter))
//     .filter((item) =>
//       dateFilter
//         ? new Date(item.date).toLocaleDateString() === dateFilter
//         : true
//     )
//     .sort((a, b) => {
//       if (sortType === "codigoAsc") {
//         return a.code.localeCompare(b.code);
//       } else if (sortType === "codigoDesc") {
//         return b.code.localeCompare(a.code);
//       } else if (sortType === "fechaAsc") {
//         return new Date(a.date) - new Date(b.date);
//       } else if (sortType === "fechaDesc") {
//         return new Date(b.date) - new Date(a.date);
//       }
//       return 0;
//     });

//   return (
//     <div>
//       <TopPages />

//       <nav className="navHistorial">
//         <Link to="/">
//           <button>Volver a la página principal</button>
//         </Link>
//         <Link to="/historial-ventas">
//           <button>Detalle Ventas</button>
//         </Link>
//         <Link to="/historial-movimientos">
//           <button>Detalle Compras y Actualizaciones</button>
//         </Link>

//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="filter-select"
//         >
//           <option value="todos">Todos los movimientos</option>
//           <option value="Venta">Ventas</option>
//           <option value="Ingreso de producto">Ingreso de producto</option>
//           <option value="Actualización de Stock">Actualización de Stock</option>
//         </select>

//         <input
//           type="date"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           className="date-filter"
//         />
//         <select
//           value={sortType}
//           onChange={(e) => setSortType(e.target.value)}
//           className="sort-select"
//         >
//           <option value="">Ordenar</option>
//           <option value="codigoAsc">Código Ascendente</option>
//           <option value="codigoDesc">Código Descendente</option>
//           <option value="fechaAsc">Fecha Ascendente</option>
//           <option value="fechaDesc">Fecha Descendente</option>
//         </select>
//       </nav>

//       <h2>Resumen de movimientos</h2>
//       <table className="dataTable">
//         <thead>
//           <tr>
//             <th>Número de Movimiento General</th>
//             <th>Tipo de Movimiento</th>
//             <th>Número de Movimiento</th>
//             <th>Código de Producto</th>
//             <th>Nombre del Producto</th>
//             <th>Fecha</th>
//             <th>Descripción</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData
//               .slice()
//               .reverse()
//               .map((item, index) => (
//                 <tr key={index}>
//                   <td>{String(item.generalCode)}</td>
//                   <td>{item.type}</td>
//                   <td>{item.code}</td>
//                   <td>{item.productCode}</td>
//                   <td>{item.productName}</td>
//                   <td>{new Date(item.date).toLocaleDateString()}</td>
//                   <td>{item.description}</td>
//                 </tr>
//               ))
//           ) : (
//             <tr>
//               <td colSpan="7">No hay movimientos registrados.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default HistoryPage;


