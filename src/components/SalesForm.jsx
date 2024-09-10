import React, { useState } from 'react';

function SalesForm({ recordSale, products, closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.code === selectedProduct);
    if (!product || quantity <= 0 || quantity > product.quantity) {
      alert('Cantidad inválida o producto no encontrado.');
      return;
    }

    const sale = {
      code: product.code,
      name: product.name,
      date: new Date().toISOString(), // Registrar la fecha actual
      quantity: parseInt(quantity, 10),
    };

    // Send the sale to the API
    fetch('https://ventuc-stock-back.onrender.com/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sale),
    })
      .then((response) => response.json())
      .then((data) => {
        recordSale(data); // Agregar la venta al estado
        closeModal();
      })
      .catch((error) => console.error('Error registrando la venta:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Venta</h2>
      <label>
        Producto:
        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
          <option value="">Seleccionar producto</option>
          {products.map((product) => (
            <option
              key={product.code}
              value={product.code}
              disabled={product.quantity === 0}
            >
              {product.name} {product.quantity === 0 ? '(Sin Stock)' : ''}
            </option>
          ))}
        </select>
      </label>
      <label>
        Cantidad:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
        />
      </label>
      <button type="submit">Registrar Venta</button>
    </form>
  );
}

export default SalesForm;
