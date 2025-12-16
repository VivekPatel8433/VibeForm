import React, { useState } from "react";

export default function PreviewForm({ form, onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleEmojiSelect = (qId, emoji) => {
    setAnswers(prev => {
      const prevAnswer = prev[qId] || [];
      const newAnswer = prevAnswer.includes(emoji)
        ? prevAnswer.filter(e => e !== emoji)
        : [...prevAnswer, emoji];
      return { ...prev, [qId]: newAnswer };
    });
  };

  const handleSubmit = () => {
    onSubmit?.(answers);
  };

  if (!form) return <p>Loading form...</p>;

  const renderInput = (q) => {
    switch (q.type) {
      case "short":
      case "email":
      case "phone":
      case "number":
      case "date":
        return (
          <input
            type={
              q.type === "phone" ? "tel" :
              q.type === "short" ? "text" :
              q.type
            }
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        );

      case "multiple":
        return (
          <div className="flex flex-col mt-2 gap-2">
            {q.options.map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={q._id}
                  checked={answers[q._id] === opt}
                  onChange={() => handleChange(q._id, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "emoji":
        return (
          <div className="flex gap-2 mt-2">
            {q.options.map(emo => {
              const selected = (answers[q._id] || []).includes(emo);
              return (
                <button
                  key={emo}
                  type="button"
                  onClick={() => handleEmojiSelect(q._id, emo)}
                  className={`text-3xl p-2 rounded ${
                    selected ? "bg-yellow-300" : "bg-gray-200"
                  }`}
                >
                  {emo}
                </button>
              );
            })}
          </div>
        );

      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  return (
    <div className="space-y-6">
      {form.questions.map(q => (
        <div key={q._id} className="p-4 bg-white rounded shadow">
          <p className="font-semibold">{q.question}</p>
          {renderInput(q)}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}
