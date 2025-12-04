import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao() {
  // Find all attempts for a quiz by a user
  function findAttemptsByUserAndQuiz(userId, quizId) {
    return model
      .find({ user: userId, quiz: quizId })
      .sort({ attemptNumber: -1 });
  }

  // Find the latest attempt for a quiz by a user
  function findLatestAttempt(userId, quizId) {
    return model
      .findOne({ user: userId, quiz: quizId })
      .sort({ attemptNumber: -1 });
  }

  // Create a new attempt
  function createAttempt(attempt) {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
  }

  // Count attempts for a quiz by a user
  function countAttempts(userId, quizId) {
    return model.countDocuments({ user: userId, quiz: quizId });
  }

  return {
    findAttemptsByUserAndQuiz,
    findLatestAttempt,
    createAttempt,
    countAttempts,
  };
}
