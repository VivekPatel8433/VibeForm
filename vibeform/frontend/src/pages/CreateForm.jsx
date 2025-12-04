import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    const newQuestion = { type, question: "", options: type === "multiple" ? [""] : [] };
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
    console.log({ title, questions });
    alert("Form created! Check console for data.");
    // Later: send to backend
  };

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div className="p-6 bg-purple-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-pink-400">Create a New Form</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <label className="block mb-2 font-medium">Form Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />

          <div className="mb-4">
            <h3 className="font-bold mb-2">Questions</h3>
            {questions.map((q, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <input
                  type="text"
                  placeholder={`Question #${index + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full mb-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />
                {q.type === "multiple" &&
                  q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex mb-1">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="ml-2 bg-pink-400 text-white px-2 rounded hover:bg-pink-500 transition"
                      >
                        + Option
                      </button>
                    </div>
                  ))}
                {q.type === "emoji" && <p className="text-gray-500">Emoji rating question</p>}
                <p className="text-sm text-gray-400">Type: {q.type}</p>
              </div>
            ))}

            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => addQuestion("short")} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition">+ Short Text</button>
              <button type="button" onClick={() => addQuestion("multiple")} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition">+ Multiple Choice</button>
              <button type="button" onClick={() => addQuestion("emoji")} className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500 transition">+ Emoji Rating</button>
            </div>
          </div>

          <button type="submit" className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition">
            Create Form
          </button>
        </form>
      </div>
    </div>
  );
}
