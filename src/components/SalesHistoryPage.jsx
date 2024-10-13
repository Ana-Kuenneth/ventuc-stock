import React, { useEffect, useCallback } from "react";
import useStore from "../store/store";
import { Link } from "react-router-dom";
import TopPages from "./TopPages";
import "../styles/Movimientos.css";

const url = "https://ventuc-stock-back.onrender.com";

function SalesHistoryPage() {
  const { sales, setSales } = useStore();
  const recordSale = useStore((state) => state.recordSale);

  const getSales = useCallback(async () => {
    try {
      const response = await fetch(`${url}/sales`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log(data);
      setSales(data);
      // recordSale(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setSales]);

  useEffect(() => {
    getSales();
    console.log(sales);
  }, [getSales]);

  if (!sales) {
    return (
      <div>
        <h2>Historial de Ventas</h2>
        <p>No hay ventas registradas.</p>
        <Link to="/">
          <button>Volver a la página principal</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <TopPages />

      <nav className="navHistorial">
        <Link to="/historial">
          <button>Volver a todo el historial</button>
        </Link>{" "}
      </nav>
      <div className="contenedorMovimientos">
        <h2>Historial de Ventas</h2>
        <table className="dataTable">
          <thead>
            <tr>
              <th>Movimiento</th>
              <th>Código del Movimiento</th>
              <th>Código del Producto</th>
              <th>Nombre del Producto</th>
              <th>Marca</th>
              <th>Fecha</th>
              <th>Cantidad Vendida</th>
              <th>Precio Unitario</th>
              <th>Incremento</th>
              <th>Descripción del incremento</th>
              <th>Total</th>
              <th>Método de Pago</th>
              <th>Vendedor</th>
            </tr>
          </thead>
          <tbody>
            {sales
              .filter((sale) => sale && Object.keys(sale).length > 0)
              .slice()
              .reverse()
              .map((sale, index) => (
                <tr key={index}>
                  <td>{sale.type}</td>
                  <td>{sale.code}</td>
                  <td>{sale.productCode}</td>
                  <td>{sale.productName}</td>
                  <td>{sale.productBrand}</td>
                  <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td>{sale.quantity}</td>
                  <td>${sale.salePrice}</td>
                  <td>${sale.incremento}</td>
                  <td>{sale.descripcionIncremento}</td>
                  <td>${sale.total}</td>
                  <td>{sale.payMethod}</td>
                  <td>{sale.client}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistoryPage;
