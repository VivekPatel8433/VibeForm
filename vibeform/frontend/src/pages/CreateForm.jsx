import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Smile, Meh, Frown, Flame } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const bubbles = useRef(
    Array.from({ length: 12 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: Math.random() * 5,
      color: ["#FDCFE8", "#B5EAEA", "#FFD6A5", "#D0C6FF"][Math.floor(Math.random() * 4)],
    }))
  ).current;

  const addQuestion = (type) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type,
      question: "",
      options: type === "multiple" ? [""] : [],
    };
    setQuestions([...questions, newQuestion]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      id: crypto.randomUUID(),
      title,
      description: "A VibeForm survey",
      questions,
    };
    navigate("/preview", { state: { formData } });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden flex justify-center items-start py-10">
      {/* Floating bubbles */}
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-30 animate-bubble"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            backgroundColor: b.color,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl">
        <Navbar isLoggedIn={true} />
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white bg-opacity-50 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30 rounded-lg"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-pink-400 animate-pulse drop-shadow-lg flex justify-center items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-pink-400" />
            Hey, Let's Create A VibeForm
          </h2>

          <label className="block mb-2 font-medium text-gray-700">Form Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:shadow-glow transition-all"
            required
          />

          <div className="mb-6">
            <h3 className="font-bold mb-4 text-lg text-gray-700">Questions</h3>
            {questions.map((q, index) => (
              <div key={q.id} className="mb-4 border p-4 rounded-xl bg-white/70">
                <input
                  type="text"
                  placeholder={`Question ${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                  required
                />
                {q.type === "multiple" &&
                  q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex mb-2 gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition"
                      >
                        + Option
                      </button>
                    </div>
                  ))}
               {q.type === "emoji" && (
                 <div className="flex gap-4 mt-2 text-gray-600 text-2xl">
                    {[Smile, Meh, Frown, Flame].map((Icon, i) => (
                <Icon
                     key={i}
                     className="w-7 h-7 cursor-pointer hover:scale-125 transition-transform hover:text-pink-400"
                />
              ))}
                  </div>
                )}
                <p className="text-sm text-gray-400 mt-1">Type: {q.type}</p>
              </div>
            ))}

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => addQuestion("short")}
                className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 transition"
              >
                + Short Text
              </button>
              <button
                type="button"
                onClick={() => addQuestion("multiple")}
                className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 transition"
              >
                + Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => addQuestion("emoji")}
                className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 transition"
              >
                + Emoji Rating
              </button>
              <button
                type="button"
                // onClick={() => )} Custom based
                className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 transition"
              >
                + Customize
              </button>
              
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-pink-400/50 font-semibold text-lg"
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
          .focus\\:shadow-glow:focus {
            box-shadow: 0 0 20px rgba(255, 192, 203, 0.5);
          }
        `}
      </style>
    </div>
  );
}
