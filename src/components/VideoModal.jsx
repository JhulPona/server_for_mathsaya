import React, { useState } from "react";
import Modal from "react-modal";
import "../App.css";

const serverUrl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const VideoModal = ({ modalOpenVideo, closeModal, modalVideoUrl }) => {
  {
    console.log(`${serverUrl}/uploads/lessons/` + modalVideoUrl);
  }
  return (
    <Modal
      isOpen={modalOpenVideo}
      onRequestClose={closeModal}
      contentLabel="Video Modal"
      className="modal rounded shadow-lg"
      overlayClassName="overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <iframe
        src={`${serverUrl}/uploads/lessons/` + modalVideoUrl}
        width="640"
        height="480"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
    </Modal>
  );
};

export default VideoModal;
