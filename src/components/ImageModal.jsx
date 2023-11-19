import React from "react";
import Modal from "react-modal";
import "../App.css";

const ImageModal = ({ modalOpenImage, closeModal, modalImageUrl }) => {
  return (
    <Modal
      isOpen={modalOpenImage}
      onRequestClose={closeModal}
      contentLabel="Image Modal"
      className="modal bg-white rounded shadow-lg"
      overlayClassName="overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
        <img src={modalImageUrl} alt="Modal" className=" p-2" />
      </div>
    </Modal>
  );
};

export default ImageModal;
