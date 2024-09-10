// components/UpdateStockForm.js
import React, { useState } from 'react';

function UpdateStockForm({ products, updateStock, closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [actionType, setActionType] = useState('increment'); // Incremento o decremento
  const [description, setDescription] = useState(''); // Descripción de la acción
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantityToUpdate = parseInt(quantity);

    if (quantityToUpdate <= 0) {
      setError('La cantidad debe ser mayor que 0.');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    updateStock(selectedProduct, quantityToUpdate, actionType, description);
    setSelectedProduct('');
    setQuantity('');
    setDescription('');
    setError('');
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Actualizar Stock</h2>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        required
      >
        <option value="" disabled>Selecciona un Producto</option>
        {products.map((product) => (
          <option key={product.code} value={product.code}>
            {product.name} (Stock actual: {product.stock})
          </option>
        ))}
      </select>

      <div>
        <label>
          <input
            type="radio"
            name="action"
            value="increment"
            checked={actionType === 'increment'}
            onChange={() => setActionType('increment')}
          />
          Aumentar Stock
        </label>
        <label>
          <input
            type="radio"
            name="action"
            value="decrement"
            checked={actionType === 'decrement'}
            onChange={() => setActionType('decrement')}
          />
          Reducir Stock
        </label>
      </div>

      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <textarea
        placeholder="Descripción de la acción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <button type="submit">Actualizar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default UpdateStockForm;
