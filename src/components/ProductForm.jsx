import React, { useState } from "react";
import useStore from "../store/store";
import Logo from "../assets/logo.jpeg";
import "../styles/ProductForm.css";

const url = "https://ventuc-stock-back.onrender.com";

function ProductForm({ closeModal }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [buyPrice, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [buyer, setBuyer] = useState("");
  const [error, setError] = useState("");

  const productCodeCounter = useStore((state) => state.productCodeCounter);
  const historyCodeCounter = useStore((state) => state.historyCodeCounter);
  const incomeCodeCounter = useStore((state) => state.incomeCodeCounter);
  const brands = useStore((state) => state.brands);
  const categories = useStore((state) => state.categories);

  const aumento = buyPrice * 0.5;
  const precioVenta = parseFloat(buyPrice) + parseFloat(aumento);

  // Formatear el código con la cantidad de ceros apropiada
  const formatCode = (counter, prefix) => {
    const digits = Math.max(5, counter.toString().length); // Mínimo 5 dígitos
    return `${prefix}-${String(counter).padStart(digits, '0')}`;
  }

  //Ruta almacena todos los productos
  const compraProducto = async (newProduct) => {
    try {
      const response = await fetch(`${url}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      return data; // Devuelve los datos del producto creado
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
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
      throw new Error(
        `Error al registrar el movimiento: ${response.statusText}`
      );
    }

    return await response.json();
  };

  //Ruta almacena todas los nuevos ingresos
  const registerIncome = async (income) => {
    const response = await fetch(`${url}/incomes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(income),
    });

    if (!response.ok) {
      throw new Error(
        `Error al registrar el ingreso de producto: ${response.statusText}`
      );
    }

    return await response.json();
  };



  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const stockNuevoProducto = parseInt(stock);

    if (isNaN(stockNuevoProducto) || stockNuevoProducto < 0) {
      setError("La cantidad debe ser un número positivo.");
      return;
    }

    if (!name) {
      setError("Ingresa el nombre del producto.");
      return;
    }

    try {
      // 1. PRODUCTO
      const newProduct = {
        name,
        description,
        image: [image],
        date: purchaseDate,
        brand,
        buyer: [buyer],
        stock: parseInt(stock),
        buyPrice: parseFloat(buyPrice),
        salePrice: precioVenta,
        category,
        // code: String(productCodeCounter).padStart(5, "0"),
        code: `P${String(productCodeCounter).padStart(5, "0")}`
      };

      const newProductData = await compraProducto(newProduct);

      // Solo agregar el producto después de obtener una respuesta exitosa del servidor
      // handleAddProduct(newProductData);

      // 2. MOVIMIENTO
      const movement = {
        type: "Ingreso de producto",
        // generalCode: String(historyCodeCounter).padStart(5, "0"),
        generalCode: formatCode(historyCodeCounter, 'HM'),
        code: formatCode(incomeCodeCounter, 'HI'), // Usa el código del producto retornado por el servidor
        productCode: newProductData.code,
        name: name,
        description: description,
        date: new Date().toISOString(),
        brand: newProductData.brand,
        buyer: String(buyer),
        previousStock: 0,
        newStock: stock,
        buyPrice: newProductData.buyPrice,
      };

      await registerMovement(movement);
      await registerIncome(movement);

      // Restablecer el estado si todo ha ido bien
      setError("");
      setName("");
      setDescription("");
      setBrand("");
      setCategory("");
      setBuyer("");
      setImage("");
      setPrice("");
      setPurchaseDate("");
      setStock("");
      console.log("Cerrando modal");
      closeModal();
      console.log("Ya se cerró");
    } catch (error) {
      console.error("Error en el registro del producto o movimiento:", error);
      setError(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setBrand("");
    setCategory("");
    setBuyer("");
    setImage("");
    setPrice("");
    setPurchaseDate("");
    setStock("");
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <div className="contenedorForm">
      <div className="titleNewProduct">
        <div className="contenedorLogoNew">
          <img className="imgLogoNew" src={Logo} alt="logo" />
        </div>
        <h2>Ingresar nuevo producto</h2>
      </div>

      <form onSubmit={handleSubmit} className="formularioNew">
        <div className="seleccionProdVenta">
          <label>
            Código del Nuevo Producto:{" "}
            <strong>{String(productCodeCounter).padStart(5, "0")}</strong>
          </label>
          <button
            type="button"
            className="botonVenta"
            onClick={handleClear} // Añadimos la función para borrar
          >
            Borrar
          </button>
        </div>

        <div className="datosNuevoProd">
          <div className="datos1">
            <label className="contenedorLabelNuevoProd">
              Nombre del Producto:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ingrese el nombre del producto"
              />
            </label>
            <label className="contenedorLabelNuevoProd">
              Descripción:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Descripción del producto"
              />
            </label>
            <label className="contenedorLabelNuevoProd">
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
            <label className="contenedorLabelNuevoProd">
              Fecha de Compra:
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="datos2">
            <label className="contenedorLabelNuevoProd">
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
            <label className="contenedorLabelNuevoProd">
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
            <label className="contenedorLabelNuevoProd">
              Precio compra: $
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                placeholder="Ingrese el precio"
              />
            </label>
            <label className="contenedorLabelNuevoProd">
              Imagen (URL):
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL de la imagen"
              />
            </label>
            <label className="contenedorLabelNuevoProd">
              Comprador:
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                placeholder="Nombre del comprador"
              />
            </label>
          </div>

          <div className="footerVentas">
            <p className="vendedorVentas">Vendedor: Usuario</p>
            <div className="botonesVenta">
              <button type="submit" className="botonVenta">
                Agregar producto
              </button>
              <button 
                type="button" className="botonVenta" onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
