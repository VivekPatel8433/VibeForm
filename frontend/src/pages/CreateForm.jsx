import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { SparklesIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import bgVideo from "../assets/24370-342401472.mp4";

export default function CreateForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showPicker, setShowPicker] = useState(null);

  // Neon bubbles
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
        "rgba(255,0,128,0.5)",
      ][Math.floor(Math.random() * 4)],
    }))
  ).current;

  // Question functions
  const addQuestion = (type) => {
    const newQuestion = {
      type,
      question: "",
      options: type === "multiple" || type === "emoji" ? [""] : [],
      required: false,
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
      const cleanQuestions = questions.map((q) => ({
        ...q,
        options:
          q.type === "multiple" || q.type === "emoji"
            ? q.options.filter((opt) => opt.trim() !== "")
            : [],
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
    <div className="relative min-h-screen flex flex-col">
      {/* Video Background */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Neon Bubbles */}
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl mx-auto py-10 flex flex-col gap-6">
        <Navbar isLoggedIn={true} />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 flex justify-center items-center gap-3">
            <SparklesIcon className="w-10 h-10 text-pink-400" />
            Create Your VibeForm
          </h1>
          <p className="text-lg text-gray-200 mt-2">
            Add questions, emojis, and multiple-choice options to build a fun survey!
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-10 shadow-2xl flex flex-col gap-6"
        >
          {/* Form Title */}
          <label className="block text-gray-100 font-bold">Form Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your Form Title"
            required
            className="w-full px-4 py-3 rounded-xl border border-white/50 bg-white/20 placeholder-gray-200 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          />

          {/* Questions */}
          <div>
            <h2 className="text-gray-100 font-bold mb-4 text-lg flex items-center gap-2">
              <PencilSquareIcon className="w-6 h-6 text-cyan-400" />
              Questions
            </h2>

            {questions.map((q, index) => (
              <div
                key={index}
                className="mb-4 border border-white/30 rounded-xl p-4 bg-white/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-white/10 placeholder-gray-300 text-gray-100 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="text-red-400 hover:text-red-600 transition"
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
                        className="flex-1 px-3 py-2 rounded bg-white/10 placeholder-gray-300 text-gray-100 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, oIndex)}
                        className="text-red-400 hover:text-red-600 transition"
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

                <p className="text-sm text-gray-200 mt-1">Type: {q.type}</p>
              </div>
            ))}

            {/* Add Question Buttons */}
            <div className="flex flex-wrap gap-3 mt-3">
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg font-semibold text-lg"
          >
            Preview Form
          </button>
        </form>
      </div>

      {/* Styles */}
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
        `}
      </style>
    </div>
  );
}
