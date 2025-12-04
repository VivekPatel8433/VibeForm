import React from "react";

export default function FormCard({ title, responses }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{responses} responses</p>
      <div className="flex justify-between">
        <button className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition">
          Edit
        </button>
        <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition">
          Delete
        </button>
      </div>
    </div>
  );
}
