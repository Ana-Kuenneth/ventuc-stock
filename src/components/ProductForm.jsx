import React, { useState } from 'react';
import useStore from '../store/store';

function ProductForm({ addProduct, closeModal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(''); // Field to handle images
  const [buyer, setBuyer] = useState(''); // Buyer field

  const productCodeCounter = useStore((state) => state.productCodeCounter);
  const brands = useStore((state) => state.brands);
  const categories = useStore((state) => state.categories); // Categories from the store

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      code: String(productCodeCounter).padStart(5, '0'),
      name,
      description,
      stock: parseInt(stock),
      date: purchaseDate,
      brand,
      category,
      price: parseFloat(price),
      image: [image], // Assuming image URLs or paths
      buyer: [buyer], // Assuming one buyer at this moment
    };

    // Llamada a la API para agregar el producto
    fetch('https://ventuc-stock-back.onrender.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        addProduct(data); // Agregar el producto al estado local después de una respuesta exitosa
        closeModal();
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Código del Producto: <strong>{String(productCodeCounter).padStart(5, '0')}</strong>
      </label>
      <label>
        Nombre del Producto:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ingrese el nombre del producto"
        />
      </label>
      <label>
        Descripción:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Descripción del producto"
        />
      </label>
      <label>
        Cantidad:
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          min="1"
          placeholder="Ingrese la cantidad"
        />
      </label>
      <label>
        Fecha de Compra:
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          required
        />
      </label>
      <label>
        Marca:
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        >
          <option value="">Seleccionar marca</option>
          {brands.map((brand) => (
            <option key={brand.code} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Categoría:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.code} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Precio:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          placeholder="Ingrese el precio"
        />
      </label>
      <label>
        Imagen (URL):
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL de la imagen"
        />
      </label>
      <label>
        Comprador:
        <input
          type="text"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          placeholder="Nombre del comprador"
        />
      </label>
      <button type="submit">Agregar Producto</button>
    </form>
  );
}

export default ProductForm;