import React, { useState, useEffect } from "react";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import UpdateStockForm from "../components/UpdateStockForm";

const InventoryPage = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { products } = useStore();
  const navigate = useNavigate();

  // useEffect(() => {}, [products]);

  return (
    <>
      <button onClick={() => navigate("/")}>
        Volver a la Página Principal
      </button>
      <Link to="/marcas">
        <button>Marcas</button>
      </Link>
      <Link to="/categorias">
        <button>Categorías</button>
      </Link>

      <button className="botones" onClick={() => setIsUpdateModalOpen(true)}>
        Actualizar Inventario
      </button>
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Cantidad</th>
            <th>Precio de costo</th>
            <th>Precio de venta</th>
          </tr>
        </thead>
        <tbody>
          {products
            .slice()
            .reverse()
            .map((product) => (
              <tr key={product.code}>
                <td>{product.code}</td>
                <td>{product.image}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>{product.stock}</td>
                <td>{product.buyPrice}</td>
                <td>{product.salePrice}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {isUpdateModalOpen && (
        <Modal closeModal={() => setIsUpdateModalOpen(false)}>
          <UpdateStockForm closeModal={() => setIsUpdateModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default InventoryPage;
