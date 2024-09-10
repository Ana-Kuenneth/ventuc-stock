import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

function SalesHistoryPage() {
  const { sales } = useStore((state) => state); // Asegúrate de que sales sea un array
  const navigate = useNavigate();

  if (!Array.isArray(sales)) {
    return (
      <div>
        <h2>Historial de Ventas</h2>
        <p>No hay ventas registradas.</p>
        <button onClick={() => navigate('/')}>Volver a la Página Principal</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Historial de Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>Movimiento</th>
            <th>Código del Producto</th>
            <th>Nombre del Producto</th>
            <th>Fecha</th>
            <th>Cantidad Vendida</th>
          </tr>
        </thead>
        <tbody>
          {sales.slice().reverse().map((sale, index) => (
            <tr key={index}>
              <td>Venta</td>
              <td>{sale.code}</td>
              <td>{sale.name}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>{sale.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/')}>Volver a la Página Principal</button>
    </div>
  );
}

export default SalesHistoryPage;
