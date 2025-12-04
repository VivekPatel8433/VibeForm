import React from "react";
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";

export default function Dashboard() {
  const forms = [
    { title: "Event Feedback", responses: 15 },
    { title: "Quick RSVP", responses: 8 },
    { title: "Customer Preferences", responses: 12 },
  ];

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div className="p-6 bg-purple-200 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-pink-400 flex justify-center">Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <FormCard key={index} title={form.title} responses={form.responses} />
          ))}
        </div>
      </div>
    </div>
  );
}

