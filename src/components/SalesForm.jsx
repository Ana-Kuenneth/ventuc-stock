import React, { useState, useEffect } from "react";
import "../styles/SalesForm.css";
import useStore from "../store/store";
import Logo from "../assets/logo.jpeg";

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
  const historyCodeCounter = useStore((state) => state.historyCodeCounter);

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
        throw new Error(
          `Error al ejecutar la venta: ${
            responseData.message || response.statusText
          }`
        );
      }

      console.log("Respuesta del servidor:", responseData);
      return responseData;
    } catch (error) {
      console.error(
        "Error en la solicitud de registro de venta:",
        error.message
      );
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

    // if (!productDetails || isNaN(quantity) || quantity <= 0) {
    //   alert("Por favor selecciona un producto válido y una cantidad positiva.");
    //   return;
    // }

    if (!productDetails) {
      alert("Por favor selecciona un producto.");
      return;
    }

    const totalSuma =
      parseFloat(productDetails.salePrice) + parseFloat(incremento);

    const sale = {
      // generalCode: String(historyCodeCounter).padStart(6, "0"),
      // generalCode: `HM${String(historyCodeCounter).padStart(6, "0")}`,
      type: "Venta de producto",
      // code: `HS${String(historyCodeCounter).padStart(4, "0")}`,
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

  const resetForm = () => {
    setSelectedProduct("");
    setQuantity("");
    setClient("");
    setIncremento(0);
    setDescIncremento("");
    setPaymentMethod("efectivo");
    setProductDetails(null);
  };

  const handleClear = () => {
    resetForm();
  };

  useEffect(() => {
    const product = products.find((p) => p.productCode == selectedProduct);
    setProductDetails(product);
  }, [selectedProduct, products]);

  return (
    <div className="contenedorForm">
      <div className="titleVenta">
        <div className="contenedorLogoVenta">
          <img className="imgLogoVenta" src={Logo} alt="logo" />
        </div>
        <h2>Registrar Venta</h2>
      </div>
      <form onSubmit={handleSubmit} className="formularioVenta">
        <label className="seleccionProdVenta">
          <div>
            Seleccione un producto:
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
          </div>

          <button
            type="button"
            className="botonVenta"
            onClick={handleClear} // Añadimos la función para borrar
          >
            Borrar
          </button>
        </label>

        <div className="datos">
          <div className="descripcionProd">
            <h3 className="subtitleVenta">Detalles del Producto</h3>
            {/* {productDetails && ( */}
            <div className="contenedorLabels">
              <p className="itemDescripcion">
                <strong>Nombre:</strong>
                {productDetails && <span>{productDetails.name}</span>}
              </p>
              <p className="itemDescripcion">
                <strong>Descripción:</strong>
                {productDetails && <span>{productDetails.description}</span>}
              </p>
              <p className="itemDescripcion">
                <strong>Categoría:</strong>{" "}
                {productDetails && <span>{productDetails.category}</span>}
              </p>
              <p className="itemDescripcion">
                <strong>Marca:</strong>{" "}
                {productDetails && <span>{productDetails.brand}</span>}
              </p>
              <p className="itemDescripcion">
                <strong>Precio de Venta:</strong> $
                {productDetails && <span>{productDetails.salePrice}</span>}
              </p>
              <p className="itemDescripcion">
                <strong>Stock Disponible:</strong>{" "}
                {productDetails && <span>{productDetails.stock}</span>}
              </p>
            </div>
          </div>

          <div className="datosVenta">
            <h3 className="subtitleVenta">Detalles de la compra</h3>
            <div className="contenedorLabels">
              <label className="itemVenta">
                Cantidad:
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  required
                />
              </label>

              <label className="itemVenta">
                Comprador:
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Nombre del comprador"
                  required
                />
              </label>

              <label className="itemVenta">
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

              <label className="itemVenta">
                Descripción del Incremento:
                <input
                  type="text"
                  value={descIncremento}
                  onChange={(e) => setDescIncremento(e.target.value)}
                  placeholder="Motivo del incremento"
                />
              </label>

              <label className="itemVenta">
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

              <p className="total">
                <strong className="totalStrong">Total: </strong>
                <span>
                  $
                  {productDetails && productDetails.salePrice
                    ? parseFloat(productDetails.salePrice) +
                      parseFloat(incremento)
                    : 0}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="footerVentas">
          <p className="vendedorVentas">Vendedor: Usuario</p>
          <div className="botonesVenta">
            <button type="submit" className="botonVenta">
              Registrar Venta
            </button>
            <button
              type="button"
              className="botonVenta"
              onClick={closeModal} 
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SalesForm;
