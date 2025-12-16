import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgVideo from "../assets/24370-342401472.mp4"; // same video

export default function FillForm({ form }) {
  const navigate = useNavigate();
  const questions = form?.questions || [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [vibePoints, setVibePoints] = useState(0);
  const [errors, setErrors] = useState({});

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const missingRequiredQuestions = useMemo(() => {
    return questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ q }) => q.required && !answers[q._id]);
  }, [answers, questions]);

  const validateAnswer = (q, value) => {
    if (q.required) {
      if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === "") {
        return "This question is required";
      }
    }
    if (value && value.toString().trim() !== "") {
      switch (q.type) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return "Please enter a valid email address";
          break;
        case "phone":
          const digitsOnly = value.replace(/\D/g, "");
          if (!(digitsOnly.length === 10 || (digitsOnly.length === 11 && digitsOnly.startsWith("1")))) {
            return "Please enter a valid Canadian phone number";
          }
          break;
        case "number":
          if (isNaN(value)) return "Please enter a valid number";
          break;
        case "date":
          if (!value) return "Please select a date";
          break;
      }
    }
    return null;
  };

  const recordAnswer = (qid, value, points = 10) => {
    const alreadyAnswered = answers[qid] !== undefined;
    setAnswers(prev => ({ ...prev, [qid]: value }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[qid];
      return newErrors;
    });

    if (!alreadyAnswered) {
      setVibePoints(prev => prev + points);
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.35 } });
    }
  };

  const goNext = () => {
    const currentQ = questions[index];
    const currentAnswer = answers[currentQ._id];
    const error = validateAnswer(currentQ, currentAnswer);

    if (error) {
      setErrors(prev => ({ ...prev, [currentQ._id]: error }));
      return;
    }

    if (index < total - 1) setIndex(i => i + 1);
    else handleFinish();
  };

  const goBack = () => index > 0 && setIndex(i => i - 1);

  const handleFinish = async () => {
    const newErrors = {};
    questions.forEach(q => {
      const error = validateAnswer(q, answers[q._id]);
      if (error) newErrors[q._id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorIndex = questions.findIndex(q => newErrors[q._id]);
      if (firstErrorIndex !== -1) setIndex(firstErrorIndex);
      return;
    }

    confetti({ particleCount: 150, spread: 90, origin: { y: 0.2 } });
    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/responses/${form._id}`, {
        answers: payload,
        vibePoints
      });
      navigate("/ThankYou", { state: { vibePoints, formTitle: form.title, answers: payload } });
    } catch (err) {
      console.error("Error submitting response:", err);
      alert("Error submitting!");
    }
  };

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

  if (!form) return <p>Loading form...</p>;

  const renderQuestion = q => {
    const qid = q._id;
    const currentAns = answers[qid];
    const error = errors[qid];

    const inputClassName = `w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
      error ? "border-red-500 focus:ring-red-400" : "focus:ring-pink-400"
    } bg-white/20 text-gray-900 placeholder-gray-300`;

    if (q.type === "short" || q.type === "text")
      return (
        <div>
          <input
            type="text"
            placeholder="Type your answer..."
            value={currentAns || ""}
            onChange={e => recordAnswer(qid, e.target.value, 5)}
            className={inputClassName}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    if (q.type === "email")
      return (
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={currentAns || ""}
            onChange={e => recordAnswer(qid, e.target.value, 5)}
            className={inputClassName}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    if (q.type === "phone")
      return (
        <div>
          <input
            type="tel"
            placeholder="403-123-4567"
            value={currentAns || ""}
            onChange={e => recordAnswer(qid, e.target.value, 5)}
            className={inputClassName}
          />
          <p className="text-xs text-gray-200 mt-1">Canadian phone number format</p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    if (q.type === "number")
      return (
        <div>
          <input
            type="number"
            placeholder="Enter a number..."
            value={currentAns || ""}
            onChange={e => recordAnswer(qid, e.target.value, 5)}
            className={inputClassName}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    if (q.type === "date")
      return (
        <div>
          <input
            type="date"
            value={currentAns || ""}
            onChange={e => recordAnswer(qid, e.target.value, 8)}
            className={inputClassName}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );

    if (q.type === "multiple")
      return (
        <div className="flex flex-col gap-3">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              type="button"
              onClick={() => recordAnswer(qid, opt, 10)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-left p-3 rounded-xl border ${
                currentAns === opt ? "bg-pink-50 ring-2 ring-pink-300" : "bg-white/20"
              } ${error ? "border-red-500" : ""}`}
            >
              {opt}
            </motion.button>
          ))}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );

    if (q.type === "emoji") {
      const selectedEmojis = currentAns || [];
      return (
        <div className="flex gap-4 justify-center flex-wrap">
          {q.options.map(emoji => {
            const isSelected = selectedEmojis.includes(emoji);
            const toggleEmoji = () => {
              const newAns = isSelected
                ? selectedEmojis.filter(e => e !== emoji)
                : [...selectedEmojis, emoji];
              recordAnswer(qid, newAns, 12);
            };
            return (
              <button
                key={emoji}
                onClick={toggleEmoji}
                className={`text-4xl p-3 rounded-full border ${
                  isSelected ? "bg-yellow-200" : "bg-white/30"
                } ${error ? "border-red-500" : ""}`}
              >
                {emoji}
              </button>
            );
          })}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-lg">
        Unknown question type: {q.type}
      </div>
    );
  };

  const progress = Math.round((answeredCount / total) * 100);

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

      <Navbar isLoggedIn={false} />

      <div className="flex-grow flex justify-center p-6 z-10 relative">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-pink-400">{form.title}</h2>
              {form.description && <p className="text-sm text-gray-200">{form.description}</p>}
            </div>
            <div className="text-right flex flex-col items-center">
              <div className="text-xs text-gray-400">Vibe Points</div>
              <motion.div
                key={vibePoints}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-lg font-semibold text-pink-500"
              >
                {vibePoints}
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden cursor-pointer">
              <motion.div
                className={`h-3 ${missingRequiredQuestions.length > 0 ? "bg-red-400" : "bg-pink-500"}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 80 }}
                onClick={() => {
                  if (missingRequiredQuestions.length > 0) setIndex(missingRequiredQuestions[0].idx);
                }}
              />
            </div>
            {missingRequiredQuestions.length > 0 && (
              <p
                className="text-sm text-red-500 mt-1 cursor-pointer"
                onClick={() => setIndex(missingRequiredQuestions[0].idx)}
              >
                {missingRequiredQuestions.length} required question
                {missingRequiredQuestions.length > 1 ? "s" : ""} remaining — click to jump
              </p>
            )}
          </div>

          {/* Question Card */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-6 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={questions[index]._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <div className="text-sm text-gray-200">
                    Question {index + 1} / {total}
                  </div>
                  <h3 className="text-xl font-semibold mt-2 text-white">
                    {questions[index].question}
                    {questions[index].required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                </div>

                <div className="mb-6">{renderQuestion(questions[index])}</div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={goBack}
                    disabled={index === 0}
                    className="px-4 py-2 rounded-lg bg-white/30 text-white disabled:opacity-40 hover:bg-white/50 transition"
                  >
                    Back
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-200 mr-2">{answeredCount} answered</div>
                    <button
                      onClick={goNext}
                      className="px-5 py-2 rounded-lg bg-pink-500 text-white shadow hover:bg-pink-600 transition"
                    >
                      {index === total - 1 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
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
