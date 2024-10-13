import React from "react";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import "../styles/HistoryPage.css";
import TopPages from "../components/TopPages";

const HistoryPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <TopPages />
      
      <nav className="navHistorial">
        <button onClick={() => navigate("/")}>
          Volver a la Página Principal
        </button>
        <div className="">
          <Link to="/historial-movimientos">
            <button className="botones">
              Historial de Compras y Actualizaciones
            </button>
          </Link>
        </div>
        <div className="">
          <Link to="/historial-ventas">
            <button className="botones">Historial de Ventas</button>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default HistoryPage;
