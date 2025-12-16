import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

export default function CreateForm() {
  
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showPicker, setShowPicker] = useState(null);
  const navigate = useNavigate();

  // Neon bubbles (CSS animation)
  const bubbles = useRef(
    Array.from({ length: 15 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 25 + Math.random() * 50,
      delay: Math.random() * 5,
      color: [
        "rgba(0,255,255,0.5)",
        "rgba(255,0,255,0.5)",
        "rgba(255,255,0,0.5)",
        "rgba(0,255,128,0.5)",
      ][Math.floor(Math.random() * 4)],
    }))
  ).current;

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: "",
      options: type === "multiple" || type === "emoji" ? [""] : [],
      required: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push("");
    setQuestions(newQuestions);
  };

  const deleteOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const cleanQuestions = questions.map(q => ({
         ...q,
        options:
        q.type === "multiple" || q.type === "emoji"
      ? q.options.filter(opt => opt.trim() !== "")
      : []
    }));
      const payload = { title, description: "VibeForm", questions: cleanQuestions };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/forms`, payload);
      navigate(`/Preview/${res.data._id}`);
    } catch (err) {
      console.error("Error creating form:", err);
      alert("Failed to create form. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-200 via-pink-300 to-purple-200 overflow-hidden flex justify-center items-start py-10">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-70 animate-bubble"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            backgroundColor: b.color,
            boxShadow: `0 0 ${b.size / 2}px ${b.color}`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl">
        <Navbar isLoggedIn={true} />
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white/20 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/30"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-pink-400 flex justify-center items-center gap-2 neon-text">
            <SparklesIcon className="w-8 h-8 text-pink-400" />
            Let's Create Your VibeForm
          </h2>

          <label className="block mb-2 font-bold text-gray-800">
            Form Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl bg-white/20 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            placeholder="Your Form Title"
            required
          />

          <div className="mb-6">
            <h3 className="font-bold mb-4 text-lg text-gray-800">Questions</h3>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 border p-4 rounded-xl bg-white/30 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded bg-white/10 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>

                {(q.type === "multiple" || q.type === "emoji") &&
                  q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex mb-2 gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded bg-white/10 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, oIndex)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {q.type === "multiple" && (
                        <button
                          type="button"
                          onClick={() => addOption(index)}
                          className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition"
                        >
                          + Option
                        </button>
                      )}
                    </div>
                  ))}

                {q.type === "emoji" && (
                  <button
                    type="button"
                    onClick={() => setShowPicker(showPicker === index ? null : index)}
                    className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-500 mb-2"
                  >
                    + Select Emoji
                  </button>
                )}

                {showPicker === index && q.type === "emoji" && (
                  <div className="mt-2 z-50">
                    <EmojiPicker
                      onEmojiClick={(emoji) => {
                        const newQuestions = [...questions];
                        newQuestions[index].options.push(emoji.emoji);
                        setQuestions(newQuestions);
                        setShowPicker(null);
                      }}
                    />
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-1">Type: {q.type}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: "+ Text", type: "short" },   
                { label: "+ Email", type: "email" },
                { label: "+ Phone", type: "phone" },
                { label: "+ DOB", type: "date" },
                { label: "+ Number", type: "number" },
                { label: "+ Multiple Choice", type: "multiple" },
                { label: "+ Emoji Rating", type: "emoji" },
          ].map((btn) => (
            <button
               key={btn.type}
               type="button"
               onClick={() => addQuestion(btn.type)}
               className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 transition"
            >
               {btn.label}
        </button>
      ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg font-semibold text-lg"
          >
            Preview Form
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes bubble-move {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-25px) translateX(15px); opacity: 0.6; }
          }
          .animate-bubble {
            animation: bubble-move 8s infinite ease-in-out;
            border-radius: 50%;
          }
          .neon-text {
            text-shadow: 0 0 8px #ff77ff, 0 0 12px #00ffff, 0 0 20px #ff77ff;
          }
        `}
      </style>
    </div>
  );
}
