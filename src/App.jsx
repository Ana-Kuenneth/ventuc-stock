import React, { useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HistoryPage from './components/HistoryPage';
import SalesHistoryPage from './components/SalesHistoryPage';
import BrandPage from './components/BrandPage';
import CategoryPage from './components/CategoryPage';
import Home from './Home';
import useStore from './store/store';

const url = "https://ventuc-stock-back.onrender.com"

function App() {
  const { setMovements, setBrands, setCategories, setProducts } = useStore();

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

  useEffect(() => {
    getBrands();
    getCategories();
    getProducts();
    getMovements();
  }, [getBrands, getCategories, getProducts, getMovements]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/historial" element={<HistoryPage />} />
        <Route path="/historial-ventas" element={<SalesHistoryPage />} />
        <Route path="/marcas" element={<BrandPage />} />
        <Route path="/categorias" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
