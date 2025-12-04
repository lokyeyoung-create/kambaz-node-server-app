import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: String,
  answer: mongoose.Schema.Types.Mixed, // String for text, Boolean for true/false, String for multiple-choice
  isCorrect: Boolean,
  pointsEarned: Number,
});

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: String,
    user: String,
    course: String,
    attemptNumber: Number,
    answers: [answerSchema],
    score: Number,
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
