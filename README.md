VibeForm

A web application for creating, sharing, and responding to interactive forms with a “vibe” mini-game feel.

1. Stack Choice & Justification

Frontend: React + Vite + Tailwind CSS
Fast development with modern React features
Responsive UI with Tailwind
Production level folder structures

Backend: Node.js + Express
Lightweight and efficient API server
Easy integration with MongoDB

Database: MongoDB
Flexible JSON-like data storage for dynamic forms and responses

Hosting: Vercel (frontend) + Render (backend)
Easy deployment, supports serverless API and environment variables

HTTP Client: Axios
Simplifies HTTP requests with async/await

Testing: 
Postman for testing routes

2. Instructions for Running Locally
Clone the repository:
git clone https://github.com/VivekPatel8433/VibeForm.git
cd VibeForm

Frontend:
cd frontend
npm install
npm run dev

This opens the frontend on the local host. 

Backend:
cd vibeform
cd backend
npm install
npm run dev

This runs the backend on local host. Remember to ask for .env file for configuration

Architecture
Form Model (forms)

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // short, multiple, emoji, custom
  question: { type: String, required: true },
  options: [String], // multiple choice or emojis
}, { _id: true });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "A VibeForm survey" },
  questions: [questionSchema],
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
}, { timestamps: true });

export default mongoose.model("Form", formSchema);


Response Model (responses)
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true }, // string for short/multiple, array for emoji
});

const responseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
    answers: [answerSchema],
    vibePoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);


Features Implemented
User Authentication: Signup and login
Form Builder: Create forms with multiple question types
Form Filling: Submit answers to forms
Backend API: /auth, /forms, /responses routes
Frontend: React with dynamic routes (dashboard, create form, fill form)
Styling & UX: Tailwind CSS, progress bar, mini-game vibe
Deployment: Frontend on Vercel, backend on Render
Testing APIs: Postman

5. What I Would Do With Another Week?
Analytics dashboard with charts/graphs
Role-based access control (admin/owner)
Shareable links with custom permissions
Enhanced UX with animations, “vibe points”, gamification
and much more.....

