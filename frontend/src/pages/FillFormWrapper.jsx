// This fixes the refresh issue and ensures that if a user navigates directly to /preview/:id, the form loads correctly.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FillForm from "../components/FillForm";

export default function FillFormWrapper() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/forms/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading form...</p>;
  if (!form) return <p>Form not found</p>;

  return <FillForm form={form} />;
}
