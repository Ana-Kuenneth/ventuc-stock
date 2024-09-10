import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Modal from './components/Modal';
import useStore from './store/store';
import ProductForm from './components/ProductForm';
import UpdateStockForm from './components/UpdateStockForm';
import SalesForm from './components/SalesForm';

const Home = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const { products, addProduct, updateStock, recordSale } = useStore();

  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      code: String(products.length + 1).padStart(5, "0"),
      date: new Date().toISOString().split('T')[0],
    };

    // Send POST request to add the product to the backend
    fetch('https://ventuc-stock-back.onrender.com/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then(response => response.json())
      .then((product) => {
        addProduct(product);  // Update Zustand state
        setIsProductModalOpen(false);  // Close the modal after adding
      })
      .catch(error => console.error('Error adding product:', error));
  };

  useEffect(() => {
  }, [ products ]);

  return (
    <>
      <div>
        <h1>Control de Stock</h1>
        <button onClick={() => setIsProductModalOpen(true)}>Agregar Producto Nuevo</button>
        <button onClick={() => setIsUpdateModalOpen(true)}>Actualizar Stock</button>
        <button onClick={() => setIsSalesModalOpen(true)}>Registrar Venta</button>
        <Link to="/historial"><button>Historial de Compras y Actualizaciones</button></Link>
        <Link to="/historial-ventas"><button>Historial de Ventas</button></Link>
        <Link to="/marcas"><button>Marcas</button></Link>
        <Link to="/categorias"><button>Categorías</button></Link>
        <h2>Lista de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Comprador</th>
            </tr>
          </thead>
          <tbody>
            {products.slice().reverse().map((product) => (
              <tr key={product.code}>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.date}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.buyer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {isProductModalOpen && (
          <Modal closeModal={() => setIsProductModalOpen(false)}>
            <ProductForm
              handleAddProduct={handleAddProduct}  // Pass the handler function
            />
          </Modal>
        )}

        {isUpdateModalOpen && (
          <Modal closeModal={() => setIsUpdateModalOpen(false)}>
            <UpdateStockForm
              products={products}
              updateStock={updateStock}
              closeModal={() => setIsUpdateModalOpen(false)}
            />
          </Modal>
        )}

        {isSalesModalOpen && (
          <Modal closeModal={() => setIsSalesModalOpen(false)}>
            <SalesForm
              recordSale={recordSale}
              products={products}
              closeModal={() => setIsSalesModalOpen(false)}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Home;
