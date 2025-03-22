import React from "react";
import deleteAllDocuments from "../../hooks/abc";
import { app } from "@/service/firebase.config"; // Adjusted path

const DeleteAllComponent = () => {
  const handleDelete = () => {
    deleteAllDocuments("NomadlyAI"); // Replace with your collection name
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={handleDelete} className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition">
        Delete All Documents
      </button>
    </div>
  );
};

export default DeleteAllComponent;
