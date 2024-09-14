import React, { useState } from "react";

const url = "https://ventuc-stock-back.onrender.com";

function UpdateStockForm({ products, updateStock, closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState(""); // Campo de descripción para el movimiento
  const [error, setError] = useState("");

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(product.stock);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantityToUpdate = parseInt(quantity);

    if (quantityToUpdate < 0) {
      setError("La cantidad no puede ser negativa.");
      return;
    }

    if (!selectedProduct) {
      setError("Selecciona un producto.");
      return;
    }

    // const aumento = selectedProduct.buyPrice * 0.5;
    // const precioVenta = selectedProduct.buyPrice + aumento; 

    const updatedProduct = {
      name: selectedProduct.name,
      description: selectedProduct.description,
      image: selectedProduct.image,
      date: selectedProduct.date,
      brand: selectedProduct.brand,
      buyer: selectedProduct.buyer,
      stock: quantityToUpdate,
      buyPrice: selectedProduct.buyPrice,
      salePrice: selectedProduct.salePrice,
      category: selectedProduct.category,
      code: selectedProduct.code,
    };

    try {
      // 1. Actualizar el stock del producto
      const response = await fetch(
        `${url}/products/actualizarStock/${selectedProduct.code}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el stock");
      }

      const updatedProductData = await response.json();
      updateStock(updatedProductData.code, updatedProductData.stock);

      // 2. Registrar el movimiento
      const movement = {
        type: "Actualización de Stock",
        code: selectedProduct.code,
        productCode: selectedProduct.code,
        name: selectedProduct.name,
        description: description, // Usamos la descripción proporcionada
        date: new Date().toISOString(),
        brand: selectedProduct.brand,
        buyer: selectedProduct.buyer,
        previousStock: selectedProduct.stock,
        newStock: quantityToUpdate,
        buyPrice: selectedProduct.buyPrice,
      };

      const movementResponse = await fetch(`${url}/movements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movement),
      });

      if (!movementResponse.ok) {
        throw new Error("Error al registrar el movimiento");
      }

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
