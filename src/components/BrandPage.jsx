import React, { useState, useEffect } from "react";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";

function BrandPage() {
  const { brands, addBrand, updateBrand, removeBrand } = useStore(); // Destructuramos `setBrands`
  const [newBrand, setNewBrand] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);
  const [editedName, setEditedName] = useState("");
  const navigate = useNavigate();

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      // Add brand to the backend
      // const brandData = { name: newBrand.trim(), date: new Date().toISOString().split('T')[0] };
      if (newBrand.trim()) {
        const brandData = {
          name: newBrand.trim().toUpperCase(),
          code: String(brands.length + 1).padStart(3, "0"),
          date: new Date().toISOString().split("T")[0],
        };
        fetch("https://ventuc-stock-back.onrender.com/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandData),
        })
          .then((response) => response.json())
          .then((brand) => {
            addBrand(brand); // Agregamos la marca al estado global
            setNewBrand("");
          })
          .catch((error) => console.error("Error adding brand:", error));
      }
    }
  };
  // const handleEditBrand = (code) => {
  //   if (editedName.trim()) {
  //     // Update brand in the backend
  //     fetch(`https://ventuc-stock-back.onrender.com/brands/${code}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name: editedName.trim() }),
  //     })
  //       .then((response) => response.json())
  //       .then(() => {
  //         updateBrand(code, editedName.trim());
  //         setEditingBrand(null);
  //         setEditedName('');
  //       })
  //       .catch((error) => console.error('Error updating brand:', error));
  //   }
  // };

  const handleDeleteBrand = (code) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      fetch(`https://ventuc-stock-back.onrender.com/brands/${code}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            removeBrand(code); // Eliminar la marca del estado de Zustand
          } else {
            console.error("Error eliminando la marca del backend");
          }
        })
        .catch((error) => console.error("Error deleting brand:", error));
    }
  };

  return (
    <div>
      <h2>Registro de Marcas</h2>
      <button onClick={() => navigate("/inventory")}>
        Volver a la Página Principal
      </button>
      <div className="agregarMarca">
        <input
          type="text"
          placeholder="Nueva Marca"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
        />
        <button onClick={handleAddBrand}>Agregar Marca</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.code}>
              <td>
                {editingBrand === brand.code ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  brand.name
                )}
              </td>
              <td>{new Date(brand.date).toLocaleDateString()}</td>
              <td>
                {/* {editingBrand === brand.code ? (
                  <>
                    <button onClick={() => handleEditBrand(brand.code)}>Guardar</button>
                    <button onClick={() => setEditingBrand(null)}>Cancelar</button>
                  </>
                ) : (
                  <> */}
                    {/* <button onClick={() => setEditingBrand(brand.code)}>Editar</button> */}
                    <button onClick={() => handleDeleteBrand(brand.code)}>Eliminar</button>
                  {/* </>
                )}*/}
               </td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// }
export default BrandPage;