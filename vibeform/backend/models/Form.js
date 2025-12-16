import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // short, multiple, emoji, custom
  question: { type: String, required: true },
  options: [String], // multiple choice or emojis
  required: { type: Boolean, default: false }
}, { _id: true });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "A VibeForm survey" },
  questions: [questionSchema],
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
}, { timestamps: true });

export default mongoose.model("Form", formSchema);
