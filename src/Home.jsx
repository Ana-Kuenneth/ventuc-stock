import React, { useState, useEffect } from "react";
import "./styles/Home.css";
import Logo from "./assets/logo.jpeg";
import { Link } from "react-router-dom";
import Modal from "./components/Modal";
import useStore from "./store/store";
import ProductForm from "./components/ProductForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faFolderOpen, faArrowUpFromBracket, faSquarePlus} from "@fortawesome/free-solid-svg-icons";

import SalesForm from "./components/SalesForm";

const Home = () => {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const { products, addProduct } = useStore();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const f = new Date();
      const dia = String(f.getDate()).padStart(2, "0");
      const mes = String(f.getMonth() + 1).padStart(2, "0");
      const anio = f.getFullYear();
      const timeString = f.toLocaleTimeString();

      const semana = [
        "DOMINGO",
        "LUNES",
        "MARTES",
        "MIÉRCOLES",
        "JUEVES",
        "VIERNES",
        "SÁBADO",
      ];
      const diaSemana = semana[f.getDay()];

      setTime(timeString);
      setDate(`${diaSemana} ${dia}-${mes}-${anio}`);
    };

    // Actualizar cada segundo
    const intervalId = setInterval(updateDateTime, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);


  const handleAddProduct = (productData) => {
    const newProduct = {
      ...productData,
      code: String(products.length + 1).padStart(5, "0"),
      date: new Date().toISOString().split("T")[0],
    };

    // Send POST request to add the product to the backend
    fetch("https://ventuc-stock-back.onrender.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((response) => response.json())
      .then((product) => {
        addProduct(product); // Update Zustand state
        setIsProductModalOpen(false); // Close the modal after adding
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  // useEffect(() => {
  // }, [ products ]);

  return (
    <>
      <div className="contenedor">
        <div className="parte1">
          <h1 className="title">Control de Stock</h1>
          <div className="contenedorLogo">

          <img className="imgLogo" src={Logo} alt="logo" />
          </div>
          <p className="subtitle">Para brindar un mejor servicio</p>
        </div>

        <div className="parte2">
          <div className="mensajeUsuario">
            <p className="fecha">{date}</p>
            <p className="hora">{time}</p>
            <p>Bienvenido Usuario</p>
          </div>
          <div className="contenedorTodosBtn">
            <div className="contenedorBtn">
              <button
                className="botones"
                onClick={() => setIsProductModalOpen(true)}
              >
                Agregar Producto Nuevo
              </button>
              <FontAwesomeIcon icon={faSquarePlus} size="2xl" style={{color: "#ffffff",}} />
            </div>
            
            <div className="contenedorBtn">
              <Link to="/historial">
                <button className="botones">Registro</button>
              </Link>
              <FontAwesomeIcon icon={faFolderOpen} size="2xl" style={{color: "#ffffff",}} />
            </div>
            
            <div className="contenedorBtn">
              <button
                className="botones"
                onClick={() => setIsSalesModalOpen(true)}
              >
                Registrar Venta
              </button>
              <FontAwesomeIcon icon={faArrowUpFromBracket} size="2xl" style={{color: "#ffffff",}}/>
            </div>
            <div className="contenedorBtn">
              <Link to="/inventory">
                <button className="botones">Inventario</button>
              </Link>
              <FontAwesomeIcon icon={faBoxesStacked} size="2xl" style={{color: "#ffffff",}} />
            </div>
          </div>
        </div>
      </div>
      {isProductModalOpen && (
        <Modal closeModal={() => setIsProductModalOpen(false)}>
          <ProductForm closeModal={() => setIsProductModalOpen(false)} />
        </Modal>
      )}



      {isSalesModalOpen && (
        <Modal closeModal={() => setIsSalesModalOpen(false)}>
          <SalesForm closeModal={() => setIsSalesModalOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Home;
