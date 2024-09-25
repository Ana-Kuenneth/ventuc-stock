import React from "react";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const HistoryPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="contenedorBtn">
        <Link to="/historial-movimientos">
          <button className="botones">
            Historial de Compras y Actualizaciones
          </button>
        </Link>
      </div>
      <div className="contenedorBtn">
        <Link to="/historial-ventas">
          <button className="botones">Historial de Ventas</button>
        </Link>
      </div>
      <button onClick={() => navigate("/")}>
        Volver a la Página Principal
      </button>
    </>
  );
};

export default HistoryPage;
