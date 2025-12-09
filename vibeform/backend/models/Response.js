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
