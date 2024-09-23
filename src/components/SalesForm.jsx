import React, { useState, useEffect } from "react";
import useStore from "../store/store";

const url = "https://ventuc-stock-back.onrender.com";

function SalesForm({ closeModal }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [code, setCode] = useState("S0001");
  const [client, setClient] = useState("");
  const [incremento, setIncremento] = useState(0);
  const [descIncremento, setDescIncremento] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [productDetails, setProductDetails] = useState(null);

  const { products, recordSale, updateStock } = useStore();

  const saleRecord = async (venta) => {
    try {
      const response = await fetch(`${url}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venta),
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        // Muestra un log con la respuesta del servidor si no es correcta
        console.error("Error en la respuesta del servidor:", responseData);
        throw new Error(`Error al ejecutar la venta: ${responseData.message || response.statusText}`);
      }
  
      console.log("Respuesta del servidor:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error en la solicitud de registro de venta:", error.message);
      throw error; // Propaga el error para que lo capture el `catch` en `handleSubmit`
    }
  };
  

  const updateStockProduct = async (updatedStock) => {
    const response = await fetch(
      `${url}/products/actualizarStock/${productDetails.code}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: updatedStock }),
      }
    );

    if (!response.ok) {
      throw new Error("Error actualizando el stock del producto");
    }

    return await response.json();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

  //   if (!productDetails || quantity <= 0) {
  //     alert("Por favor selecciona un producto válido y una cantidad válida.");
  //     return;
  //  }

    if (!productDetails) {
      alert("Por favor selecciona un producto.");
      return;
    }

    const totalSuma = parseFloat(productDetails.salePrice) + parseFloat(incremento);

    const sale = {
      type: "Venta de producto",
      code: code,
      productCode: productDetails.code,
      productName: productDetails.name,
      productDescription: productDetails.description,
      saleDate: new Date().toISOString(),
      productBrand: productDetails.brand,
      client: client,
      previousStock: productDetails.stock,
      newStock: productDetails.stock - quantity,
      quantity: parseInt(quantity, 10),
      salePrice: productDetails.salePrice,
      incremento: incremento,
      descripcionIncremento: descIncremento,
      total: totalSuma,
      payMethod: paymentMethod,
    };

    // Verificar los datos de la venta
    console.log("Datos de la venta:", sale);

    try {
      // 1. Ejecutar la venta
      // const saleData =
       await saleRecord(sale);
      // recordSale(saleData);

      // 2. Actualizar el stock de los productos
      const updatedStock = productDetails.stock - quantity;
      // const updatedProductData = 
      await updateStockProduct(updatedStock);
      // updateStock(updatedProductData.code, updatedProductData.stock);

      //3. Restablecer el estado si todo ha ido bien
      setSelectedProduct("");
      setQuantity("");
      setClient("");
      setIncremento(0);
      setDescIncremento("");
      setPaymentMethod("efectivo");
      setProductDetails(null);

      // resetForm();
      closeModal();
    } catch (error) {
      console.error("Error registrando la venta:", error);
    }
  };

  useEffect(() => {
    const product = products.find((p) => p.code == selectedProduct);
    setProductDetails(product);
  }, [selectedProduct, products]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Venta</h2>
      <label>
        Producto:
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Seleccionar producto</option>
          {products.map((product) => (
            <option
              key={product.code}
              value={product.code}
              disabled={product.stock === 0}
            >
              {product.name} {product.stock === 0 ? "(Sin Stock)" : ""}
            </option>
          ))}
        </select>
      </label>

      {productDetails && (
        <div>
          <h3>Detalles del Producto Seleccionado</h3>
          <p>
            <strong>Nombre:</strong> {productDetails.name}
          </p>
          <p>
            <strong>Descripción:</strong> {productDetails.description}
          </p>
          <p>
            <strong>Categoría:</strong> {productDetails.category}
          </p>
          <p>
            <strong>Marca:</strong> {productDetails.brand}
          </p>
          <p>
            <strong>Precio de Venta:</strong> {productDetails.salePrice}
          </p>
          <p>
            <strong>Stock Disponible:</strong> {productDetails.stock}
          </p>
        </div>
      )}

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

      <label>
        Comprador:
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Nombre del comprador"
          required
        />
      </label>

      <label>
        Incremento:
        <input
          type="number"
          value={incremento}
          onChange={(e) => setIncremento(Number(e.target.value))}
          min="0"
          step="1"
          placeholder="Incremento en el precio"
        />
      </label>

      <label>
        Descripción del Incremento:
        <input
          type="text"
          value={descIncremento}
          onChange={(e) => setDescIncremento(e.target.value)}
          placeholder="Motivo del incremento"
        />
      </label>

      <label>
        Método de Pago:
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
      </label>

      {productDetails && (
        <p>
          <strong>Total:</strong> $
          {parseFloat(productDetails.salePrice) + parseFloat(incremento)}
        </p>
      )}

      <button type="submit">Registrar Venta</button>
    </form>
  );
}

export default SalesForm;
