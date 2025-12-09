import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Smile, Meh, Frown, Flame, Trash2 } from "lucide-react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import EmojiPicker from "emoji-picker-react";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(null);

  // Y2K neon bubbles
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
      id: crypto.randomUUID(),
      type,
      question: "",
      options: type === "multiple" ? [""] : [],
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
          <h2 className="text-4xl font-bold mb-8 text-center text-pink-400 animate-pulse drop-shadow-neon flex justify-center items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-pink-400 drop-shadow-neon" />
            Let&apos;s Create Your VibeForm
          </h2>

          <label className="block mb-2 font-bold text-gray-800 drop-shadow-neon">
            Form Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-6 px-4 py-3 border border-white/50 rounded-xl bg-white/20 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-neon transition-all"
            placeholder="Your Form Title"
            required
          />

          <div className="mb-6">
            <h3 className="font-bold mb-4 text-lg text-gray-800 drop-shadow-neon">
              Questions
            </h3>
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="mb-4 border p-4 rounded-xl bg-white/30 backdrop-blur-md drop-shadow-neon"
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded bg-white/10 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:shadow-neon transition"
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

                {q.type === "multiple" &&
                  q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex mb-2 gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded bg-white/10 placeholder-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:shadow-neon transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(index, oIndex)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 drop-shadow-neon transition"
                      >
                        + Option
                      </button>
                    </div>
                  ))}

          {q.type === "emoji" && (
              <div className="mb-2">
         {/* Display selected emojis */}
              <div className="flex gap-2 flex-wrap mb-2">
         {q.options.map((emo, oIndex) => (
              <div
                key={oIndex}
                className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded"
          >
          <span className="text-2xl">{emo}</span>
          <button
            type="button"
            onClick={() => {
              const newQuestions = [...questions];
              newQuestions[index].options.splice(oIndex, 1);
              setQuestions(newQuestions);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>

           {/* Button to open emoji picker */}
         <button
             type="button"
             onClick={() => setShowPicker(showPicker === index ? null : index)}
             className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-500"
          >
            + Select Emoji
          </button>

         {/* Emoji picker popup */}
         {showPicker === index && (
             <div className="mt-2 z-50">
             <EmojiPicker
               onEmojiClick={(emoji) => {
               const newQuestions = [...questions];
               newQuestions[index].options.push(emoji.emoji);
               setQuestions(newQuestions);
               setShowPicker(null); // close picker after selection
               }}
             />
             </div>
           )}
       </div>
    )}

                <p className="text-sm text-gray-400 mt-1">Type: {q.type}</p>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 mb-6">
              {["short", "multiple", "emoji", "custom"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addQuestion(type)}
                  className="bg-pink-400 text-white px-4 py-2 rounded-xl hover:bg-pink-500 drop-shadow-neon transition"
                >
                  {type === "short"
                    ? "+ Short Text"
                    : type === "multiple"
                    ? "+ Multiple Choice"
                    : type === "emoji"
                    ? "+ Emoji Rating"
                    : "+ Customize"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 hover:scale-105 transition-transform duration-200 shadow-lg drop-shadow-neon font-semibold text-lg"
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
          .drop-shadow-neon {
            text-shadow: 0 0 8px #ff77ff, 0 0 12px #00ffff, 0 0 20px #ff77ff;
          }
          .focus\\:shadow-neon:focus {
            box-shadow: 0 0 25px #ff77ff;
          }
        `}
      </style>
    </div>
  );
}
