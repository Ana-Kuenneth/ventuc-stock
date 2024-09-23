import React, { useState, useEffect } from "react";
import useStore from "../store/store";
import { useNavigate } from "react-router-dom";

function CategoryPage() {
  const { categories, addCategory, updateCategory, removeCategory } = useStore(); // Destructuramos `setBrands`
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const navigate = useNavigate();

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Add category to the backend
      // const categoryData = { name: newCategory.trim(), date: new Date().toISOString().split('T')[0] };
      if (newCategory.trim()) {
        const categoryData = {
          name: newCategory.trim().toUpperCase(),
          code: String(categories.length + 1).padStart(3, "0"),
          date: new Date().toISOString().split("T")[0],
        };
        fetch("https://ventuc-stock-back.onrender.com/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })
          .then((response) => response.json())
          .then((category) => {
            addCategory(category); // Agregamos la categoría al estado global
            setNewCategory("");
          })
          .catch((error) => console.error("Error adding category:", error));
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

  const handleDeleteCategory = (code) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      fetch(`https://ventuc-stock-back.onrender.com/categories/${code}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            removeCategory(code); // Eliminar la categoría del estado de Zustand
          } else {
            console.error("Error eliminando la categoría del backend");
          }
        })
        .catch((error) => console.error("Error deleting category:", error));
    }
  };

  return (
    <div>
      <h2>Registro de Categorías</h2>
      <button onClick={() => navigate("/inventory")}>
        Volver a la Página Principal
      </button>
      <div className="agregarCategoría">
        <input
          type="text"
          placeholder="Nueva Categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Agregar Categoría</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.code}>
              <td>
                {editingCategory === category.code ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                    category.name
                )}
              </td>
              <td>{new Date(category.date).toLocaleDateString()}</td>
              {/* <td>
                {editingCategory === category.code ? (
                  <>
                    <button onClick={() => handleEditCategory(category.code)}>Guardar</button>
                    <button onClick={() => setEditingCategory(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingCategory(category.code)}>Editar</button>
                    </>
                    )}
                    </td> */}
              <td>
                <button onClick={() => handleDeleteCategory(category.code)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CategoryPage;