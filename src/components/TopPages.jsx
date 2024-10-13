import React from "react";
import "../styles/TopPages.css"
import Logo from "../assets/logo.jpeg";

const TopPages = () => {
  return (
    <div className="parte1">
      <h1 className="title">Control de Stock</h1>
      <div className="contenedorLogo">
        <img className="imgLogo" src={Logo} alt="logo" />
      </div>
      <p className="subtitle">Para brindar un mejor servicio</p>
    </div>
  );
};

export default TopPages;
