import Form from "../models/Form.js";
import Response from "../models/Response.js";

// Create form
export const createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all forms
export const getForms = async (req, res) => {
  try {
    const forms = await Form.find().populate("responses");
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single form
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate("responses");
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete form
export const deleteForm = async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Form
export const updateForm = async (req, res) => {
  const { formId } = req.params;
  const { title, description, questions } = req.body;

  const updatedForm = await Form.findByIdAndUpdate(
    formId,
    { title, description, questions },
    { new: true }
  );
  res.status(200).json(updatedForm);
};