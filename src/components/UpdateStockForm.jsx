import React, { useState } from "react";

const url = "https://ventuc-stock-back.onrender.com";

function UpdateStockForm({ products, updateStock, closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el cambio de selección del producto
  const handleProductClick = (product) => {
    setSelectedProduct(product); // Guarda el producto completo
    setQuantity(product.stock); // Establece la cantidad basada en el stock del producto seleccionado
  };

  const handleSubmit = (e) => {
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

    // const updatedProduct = {
    //   ...selectedProduct,
    //   stock: quantityToUpdate,
    // };
    const updatedProduct = {
      name: selectedProduct.name,
      description: selectedProduct.description,
      image: selectedProduct.image,
      date: selectedProduct.date,
      brand: selectedProduct.brand,
      buyer: selectedProduct.buyer,
      stock: quantityToUpdate,
      price: selectedProduct.price,
      category: selectedProduct.category,
      code: selectedProduct.code,
    };

    // const productCode = String(selectedProduct.code);
    console.log('Product Code:', selectedProduct.code);
    
    fetch(
      `${url}/products/actualizarStock/${selectedProduct.code}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      }
    )
      .then((response) => response.json())
      .then((updatedProduct) => {
        updateStock(updatedProduct.code, updatedProduct.stock); // Actualiza el estado global
        setSelectedProduct(null); // Limpia la selección
        setQuantity("");
        setError("");
        closeModal();
      })
      .catch((error) => {
        console.error("Error al actualizar el stock:", error);
        setError(`Error al actualizar el stock: ${error.message}`);
      });
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

      <button type="submit">Actualizar Stock</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default UpdateStockForm;
