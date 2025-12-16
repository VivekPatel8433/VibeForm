import React, { useState, useEffect } from "react";

export default function PreviewForm({ form: rawForm, onSubmit }) {
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!rawForm) return;

    const formatted = {
      ...rawForm,
      questions: rawForm.questions.map(q => ({
        ...q,
        _id: typeof q._id === "object" && q._id.$oid ? q._id.$oid : q._id,
        type: q.type?.trim().toLowerCase() // Normalize type
      }))
    };
    setForm(formatted);
  }, [rawForm]);

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleEmojiToggle = (qId, emoji) => {
    setAnswers(prev => {
      const current = prev[qId] || [];
      return {
        ...prev,
        [qId]: current.includes(emoji)
          ? current.filter(e => e !== emoji)
          : [...current, emoji]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(answers);
  };

  if (!form) return <p>Loading form...</p>;

  const renderQuestion = (q) => {
    // Debug log
    console.log('Rendering question:', q.type, q);
    
    const type = q.type?.trim().toLowerCase();
    
    switch (type) {
      case "short":
      case "text":
        return (
          <input
            type="text"
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-3 border rounded w-full"
            placeholder="Enter your answer"
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-3 border rounded w-full"
            placeholder="your@email.com"
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-3 border rounded w-full"
            placeholder="123-456-7890"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-3 border rounded w-full"
            placeholder="Enter a number"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={answers[q._id] || ""}
            onChange={e => handleChange(q._id, e.target.value)}
            className="mt-2 p-3 border rounded w-full"
          />
        );
      case "multiple":
        return (
          <div className="flex flex-col gap-2 mt-2">
            {q.options && q.options.length > 0 ? (
              q.options.map((opt, i) => (
                <label key={i} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name={q._id}
                    checked={answers[q._id] === opt}
                    onChange={() => handleChange(q._id, opt)}
                  />
                  {opt}
                </label>
              ))
            ) : (
              <p className="text-gray-500 italic">No options available</p>
            )}
          </div>
        );
      case "emoji":
        return (
          <div className="flex gap-3 mt-2 text-3xl flex-wrap">
            {q.options && q.options.length > 0 ? (
              q.options.map((emoji, i) => {
                const selected = (answers[q._id] || []).includes(emoji);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleEmojiToggle(q._id, emoji)}
                    className={`p-2 rounded ${
                      selected ? "bg-yellow-300" : "bg-gray-200"
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })
            ) : (
              <p className="text-gray-500 italic">No emojis available</p>
            )}
          </div>
        );
      default:
        return (
          <div className="text-red-500 bg-red-50 p-3 rounded">
            <p className="font-semibold">Unknown question type: "{q.type}"</p>
            <p className="text-sm mt-1">Raw type value: {JSON.stringify(q.type)}</p>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">{form.title}</h2>
      <p className="text-gray-600">{form.description}</p>

      {form.questions.map(q => (
        <div key={q._id} className="p-4 bg-white rounded-xl shadow">
          <label className="font-semibold block mb-1">
            {q.question}
            {q.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderQuestion(q)}
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-pink-400 text-white py-3 rounded-xl hover:bg-pink-500 transition font-semibold"
      >
        Submit
      </button>
    </form>
  );
}