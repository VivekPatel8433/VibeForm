import React, { useState } from "react";

export default function PreviewForm({ form, onSubmit }) {
  const [answers, setAnswers] = useState({}); // key: questionId, value: answer

  const handleShortInput = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleEmojiSelect = (qId, emoji) => {
    setAnswers(prev => {
      const prevAnswer = prev[qId] || [];
      let newAnswer;
      if (prevAnswer.includes(emoji)) {
        newAnswer = prevAnswer.filter(e => e !== emoji); // deselect
      } else {
        newAnswer = [...prevAnswer, emoji]; // select
      }
      return { ...prev, [qId]: newAnswer };
    });
  };

  const handleSubmit = () => {
    if (onSubmit) onSubmit(answers);
  };

  if (!form) return <p>Loading form...</p>;

  return (
    <div className="space-y-6">
      {form.questions.map(q => (
        <div key={q._id} className="p-4 bg-white rounded shadow">
          <p className="font-semibold">{q.question}</p>

          {q.type === "short" && (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={e => handleShortInput(q._id, e.target.value)}
              className="mt-2 p-2 border rounded w-full"
            />
          )}

          {q.type === "emoji" && (
            <div className="flex gap-2 mt-2">
              {q.options.map(emo => {
                const selected = (answers[q._id] || []).includes(emo);
                return (
                  <button
                    key={emo}
                    onClick={() => handleEmojiSelect(q._id, emo)}
                    className={`text-3xl p-2 rounded ${selected ? "bg-yellow-300" : "bg-gray-200"}`}
                  >
                    {emo}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "multiple" && (
            <div className="flex flex-col mt-2 gap-2">
              {q.options.map(opt => {
                const selected = answers[q._id] === opt;
                return (
                  <label key={opt} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={selected}
                      onChange={() => setAnswers(prev => ({ ...prev, [q._id]: opt }))}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
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
