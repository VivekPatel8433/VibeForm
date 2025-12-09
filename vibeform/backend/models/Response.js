import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: { type: Map, of: String, required: true },
  vibePoints: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Response", responseSchema);
