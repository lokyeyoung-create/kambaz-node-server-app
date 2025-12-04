import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  _id: String,
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  _id: String,
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "fill-in-blank"],
    default: "multiple-choice",
  },
  title: String,
  points: { type: Number, default: 0 },
  question: String,
  choices: [choiceSchema], // For multiple-choice
  correctAnswer: mongoose.Schema.Types.Mixed, // Boolean for true/false, array of strings for fill-in-blank
});

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Unnamed Quiz" },
    course: String,
    description: String,
    published: { type: Boolean, default: false },
    quizType: {
      type: String,
      enum: [
        "graded-quiz",
        "practice-quiz",
        "graded-survey",
        "ungraded-survey",
      ],
      default: "graded-quiz",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["quizzes", "exams", "assignments", "project"],
      default: "quizzes",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtTime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: String,
    availableDate: String,
    untilDate: String,
    questions: [questionSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;
