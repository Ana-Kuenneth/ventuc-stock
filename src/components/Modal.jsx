import React, { useEffect }from 'react';
import '../styles/Modal.css'; // Asegúrate de que tienes estilos para el modal
import useStore from '../store/store';

function Modal({ children, closeModal }) {
  const { products, categories, brands } = useStore();

  useEffect(() => {
  }, [products, categories, brands])

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>✖</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
