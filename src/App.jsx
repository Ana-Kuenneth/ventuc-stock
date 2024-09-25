import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import MovementsHistoryPage from "./components/MovementsHistoryPage";
import SalesHistoryPage from "./components/SalesHistoryPage";
import BrandPage from "./components/BrandPage";
import CategoryPage from "./components/CategoryPage";
import InventoryPage from "./pages/InventoryPage";
import Home from "./Home";
import useStore from "./store/store";

const url = "https://ventuc-stock-back.onrender.com";

function App() {
  const {
    movements,
    setMovements,
    setBrands,
    setCategories,
    setProducts,
    recordSale,
  } = useStore();

  // Si alguna de las funciones es undefined, maneja el error
  if (!setBrands || !setCategories || !setProducts) {
    console.error("Algunos métodos de la tienda no están disponibles.");
    return null;
  }

  const getBrands = useCallback(async () => {
    try {
      const response = await fetch(`${url}/brands`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setBrands(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setBrands]);

  const getCategories = useCallback(async () => {
    try {
      const response = await fetch(`${url}/categories`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setCategories]);

  const getProducts = useCallback(async () => {
    try {
      const response = await fetch(`${url}/products`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setProducts]);

  const getMovements = useCallback(async () => {
    try {
      const response = await fetch(`${url}/movements`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      setMovements(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setMovements]);

  const getSales = useCallback(async () => {
    try {
      const response = await fetch(`${url}/sales`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();

      recordSale(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [recordSale]);

  // const getSaleMovements = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${url}/salesMovements`);
  //     if (!response.ok) {
  //       throw new Error("Error en la solicitud: " + response.status);
  //     }
  //     const data = await response.json();

  //     setSaleMovements(data);

  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }, [setSaleMovements]);

  useEffect(() => {
    getBrands();
    getCategories();
    getProducts();
    getMovements();
    getSales();
  }, [getBrands, getCategories, getProducts, getMovements, getSales]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historial" element={<HistoryPage />} />
        <Route
          path="/historial-movimientos"
          element={<MovementsHistoryPage />}
        />
        <Route path="/historial-ventas" element={<SalesHistoryPage />} />
        <Route path="/marcas" element={<BrandPage />} />
        <Route path="/categorias" element={<CategoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
