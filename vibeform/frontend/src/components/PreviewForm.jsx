import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FillForm from "../components/FillForm";

export default function PreviewForm() {
  const { state } = useLocation();
  const form = state?.formData;
  const [isCompleted, setIsCompleted] = useState(false);
  const [shareLink, setShareLink] = useState("");

  if (!form) return <div>No form data found.</div>;

  const handleComplete = (answers, vibePoints) => {
    console.log("Form submitted:", answers, vibePoints);

    const link = `${window.location.origin}/fill/${form.id}`;
    setShareLink(link);
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You for Completing the Form!</h1>
        <p className="text-gray-700 mb-6">You can now share this form with others.</p>

        <div className="border rounded-lg p-5 shadow-md bg-white mb-6 text-left">
          <h2 className="text-xl font-semibold">{form.title}</h2>
          <p className="text-gray-600 mt-1">A VibeForm survey created by you.</p>
        </div>

        <div className="bg-gray-100 p-3 rounded border mb-4">
          <p className="font-semibold">Shareable Link:</p>
          <p className="text-blue-600">{shareLink}</p>
        </div>

        <div className="space-x-3 mt-4">
          <button onClick={() => navigator.clipboard.writeText(shareLink)} className="bg-blue-500 text-white px-4 py-2 rounded">Copy Link</button>
          <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`)} className="bg-blue-700 text-white px-4 py-2 rounded">Share on Facebook</button>
          <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=Check%20out%20my%20new%20form!`)} className="bg-black text-white px-4 py-2 rounded">Share on X</button>
        </div>
      </div>
    );
  }

  return <FillForm form={form} onComplete={handleComplete} />;
}
