import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import * as Icons from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms`);
        setForms(res.data);
      } catch (err) {
        console.error("Error fetching forms:", err);
      }
    };
    fetchForms();
  }, []);

  const deleteForm = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/forms/${id}`);
      setForms(forms.filter(f => f._id !== id));
      if (selectedForm?._id === id) setSelectedForm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResponse = async (formId, respId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/forms/${formId}/responses/${respId}`);
      const updatedForms = forms.map(f =>
        f._id === formId
          ? { ...f, responses: f.responses.filter(r => r._id !== respId) }
          : f
      );
      setForms(updatedForms);
      if (selectedForm?._id === formId) setSelectedForm(updatedForms.find(f => f._id === formId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 text-white transition-all duration-500">
      <Navbar isLoggedIn={true} />
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        
        {/* Form List */}
        <div className="md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold mb-2 text-neon-purple animate-pulse">Your Forms</h2>
          {forms.map(f => (
            <div
              key={f._id}
              onClick={() => setSelectedForm(f)}
              className={`p-4 rounded-2xl shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedForm?._id === f._id ? "bg-neon-purple/20 border-2 border-neon-purple" : "bg-gray-800"
              }`}
            >
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{f.questions.length} Qs • {f.responses?.length || 0} responses</p>
              <button
                onClick={(e) => { e.stopPropagation(); deleteForm(f._id); }}
                className="mt-2 text-red-500 text-sm hover:underline"
              >
                Delete Form
              </button>
            </div>
          ))}
        </div>

        {/* Selected Form Panel */}
        <div className="md:w-2/3 bg-gray-900 p-6 rounded-2xl shadow-lg border border-neon-purple transition-all duration-300">
          {!selectedForm ? (
            <p className="text-gray-400 italic animate-pulse">Select a form to view questions & responses</p>
          ) : (
            <>
              <button
                onClick={() => setSelectedForm(null)}
                className="mb-4 px-4 py-2 bg-neon-purple text-black font-bold rounded-xl hover:bg-neon-pink transition"
              >
                ← Back to Forms
              </button>

              <h2 className="text-2xl font-bold text-neon-purple animate-pulse">{selectedForm.title}</h2>
              <p className="text-gray-300 mb-6">{selectedForm.description}</p>

              {/* Questions */}
              <h3 className="text-lg font-semibold mb-2 text-neon-cyan">Questions</h3>
              <ul className="list-disc ml-5 mb-6">
                {selectedForm.questions.map((q) => (
                  <li key={q._id} className="hover:text-neon-pink transition">
                    {q.question}{" "}
                    <span className="text-xs text-gray-400">
                      ({q.type === "multiple" ? "Multiple Choice" : q.type === "emoji" ? "Emoji Rating" : q.type})
                    </span>
                  </li>
                ))}
              </ul>

              {/* Responses */}
              <h3 className="text-lg font-semibold mb-2 text-neon-cyan">Responses</h3>
              {selectedForm.responses.length === 0 ? (
                <p className="text-gray-400 flex items-center gap-2">
                  <Icons.Frown size={18} /> No responses yet
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedForm.responses.map(r => (
                    <div key={r._id} className="border-l-4 border-neon-purple bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-neon transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-neon-pink">Vibe Points: {r.vibePoints}</span>
                        <button
                          onClick={() => deleteResponse(selectedForm._id, r._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Icons.Trash2 />
                        </button>
                      </div>
                      <ul className="ml-4 list-disc text-gray-200">
                        {r.answers.map((a) => {
                          const question = selectedForm.questions.find(
                            (q) => q.id === a.questionId || q._id === a.questionId
                          );
                          return (
                            <li key={a._id || a.questionId} className="hover:text-neon-cyan transition">
                              <strong>{question?.question || "Unknown Question"}:</strong>{" "}
                              {Array.isArray(a.answer) ? a.answer.join(", ") : a.answer}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Neon animation classes */}
      <style>
        {`
          .text-neon-purple { color: #b800ff; text-shadow: 0 0 5px #b800ff, 0 0 10px #b800ff; }
          .text-neon-cyan { color: #00fff7; text-shadow: 0 0 5px #00fff7, 0 0 10px #00fff7; }
          .text-neon-pink { color: #ff00d4; text-shadow: 0 0 5px #ff00d4, 0 0 10px #ff00d4; }
          .bg-neon-purple { background-color: rgba(184, 0, 255, 0.3); }
          .bg-neon-pink { background-color: rgba(255, 0, 212, 0.3); }
          .hover\\:shadow-neon:hover { box-shadow: 0 0 20px #b800ff, 0 0 40px #ff00d4, 0 0 60px #00fff7; }
        `}
      </style>
    </div>
  );
}
