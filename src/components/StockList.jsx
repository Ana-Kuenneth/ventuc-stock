// components/StockList.js
import React from 'react';

function StockList({ products }) {
  return (
    <div>
      <h2>Stock Actual</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            Código: {product.code} - {product.name}: {product.quantity} unidades (Comprado el: {product.purchaseDate})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StockList;
