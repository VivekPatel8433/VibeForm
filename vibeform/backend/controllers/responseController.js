import Response from "../models/Response.js";
import Form from "../models/Form.js";

// Submit a response
export const submitResponse = async (req, res) => {
  try {
    const { answers, vibePoints } = req.body;
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const response = await Response.create({ form: formId, answers, vibePoints });
    form.responses.push(response._id);
    await form.save();

    res.status(201).json({ message: "Response submitted", response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
