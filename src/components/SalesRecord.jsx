// components/SalesRecord.js
import React from 'react';

function SalesRecord({ sales }) {
  return (
    <div>
      <h2>Registro de Ventas</h2>
      <ul>
        {sales.map((sale, index) => (
          <li key={index}>
            Producto: {sale.productName}, Cantidad Vendida: {sale.quantitySold}, Fecha: {sale.date.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalesRecord;
