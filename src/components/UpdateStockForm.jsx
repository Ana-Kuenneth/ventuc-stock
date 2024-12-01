import React, { useState } from "react";
import useStore from '../store/store';

const url = "https://ventuc-stock-back.onrender.com";

function UpdateStockForm({ closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState(""); // Campo de descripción para el movimiento
  const [error, setError] = useState("");

  const { products, updateStock, historyCodeCounter, actualitationCodeCounter } = useStore();

  // Formatear el código con la cantidad de ceros apropiada
  const formatCode = (counter, prefix) => {
    const digits = Math.max(5, counter.toString().length); // Mínimo 5 dígitos
    return `${prefix}-${String(counter).padStart(digits, '0')}`;
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(product.stock);
  };

  //Ruta corrije el actual stock de cada producto
  const updateProductStock = async (productCode, stock) => {
    const response = await fetch(`${url}/products/actualizarStock/${productCode}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stock }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el stock: ${response.statusText}`);
    }

    return await response.json();
  };


  //Ruta almacena todos los movimientos (venta, ingreso, actualizacion stock)
  const registerMovement = async (movement) => {
    const response = await fetch(`${url}/movements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movement),
    });

    if (!response.ok) {
      throw new Error(`Error al registrar el movimiento: ${response.statusText}`);
    }

    return await response.json();
  };


  //Ruta almacena todas las actualizaciones
  //(poner)  



  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantityToUpdate = parseInt(quantity);

    if (isNaN(quantityToUpdate) || quantityToUpdate < 0) {
      setError("La cantidad debe ser un número positivo.");
      return;
    }

    if (!selectedProduct) {
      setError("Selecciona un producto.");
      return;
    }

    try {
      // 1. Actualizar el stock del producto
      const updatedProductData = await updateProductStock(selectedProduct.code, quantityToUpdate);
      

      // 2. Registrar el movimiento
      const movement = {
        type: "Actualización de Stock",
        generalCode: formatCode(historyCodeCounter, 'HM'),
        code: formatCode(actualitationCodeCounter, 'HA'),
        productCode: selectedProduct.code,
        name: selectedProduct.name,
        description: description, // Usamos la descripción proporcionada
        date: new Date().toISOString(),
        brand: selectedProduct.brand,
        buyer: String(selectedProduct.buyer),
        previousStock: selectedProduct.stock,
        newStock: quantityToUpdate,
        buyPrice: selectedProduct.buyPrice,
      };

      updateStock(updatedProductData.code, updatedProductData.stock, movement);
      await registerMovement(movement);

      // Restablecer el estado si todo ha ido bien
      setSelectedProduct(null);
      setQuantity("");
      setDescription("");
      setError("");
      closeModal();

    } catch (error) {
      console.error("Error en la actualización o movimiento:", error);
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Actualizar Stock</h2>
      <div>
        {products.map((product) => (
          <div
            key={product.code}
            onClick={() => handleProductClick(product)}
            style={{
              cursor: "pointer",
              border: "1px solid black",
              padding: "5px",
              marginBottom: "5px",
              backgroundColor:
                selectedProduct && selectedProduct.code === product.code
                  ? "#f0f0f0"
                  : "white",
            }}
          >
            {product.name} (Stock actual: {product.stock})
          </div>
        ))}
      </div>

      <input
        type="number"
        min="0"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      {/* Agregar un campo de descripción */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del cambio de stock"
        required
      />

      <button type="submit">Actualizar Stock</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default UpdateStockForm;
