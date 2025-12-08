// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FillForm from "./components/FillForm";
import Dashboard from "./pages/Dashboard"
import CreateForm from "./pages/CreateForm";
import Login from "./pages/Login";
import PreviewForm from "./components/PreviewForm";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/CreateForm" element={<CreateForm/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/preview" element={<PreviewForm/>} />
        
      </Routes>
    </BrowserRouter>
  );
}
