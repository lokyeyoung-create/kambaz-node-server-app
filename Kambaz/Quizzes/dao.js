import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  // Find all quizzes for a course
  function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
  }

  // Create a new quiz
  function createQuiz(quiz) {
    const newQuiz = {
      ...quiz,
      _id: uuidv4(),
      questions: quiz.questions || [],
    };
    return model.create(newQuiz);
  }

  // Delete a quiz
  function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  // Update a quiz
  function updateQuiz(quizId, quizUpdates) {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  }

  // Find a single quiz by ID
  function findQuizById(quizId) {
    return model.findById(quizId);
  }

  // Add a question to a quiz
  function addQuestion(quizId, question) {
    const newQuestion = { ...question, _id: uuidv4() };
    return model
      .updateOne({ _id: quizId }, { $push: { questions: newQuestion } })
      .then(() => newQuestion);
  }

  // Update a question in a quiz
  function updateQuestion(quizId, questionId, questionUpdates) {
    return model.updateOne(
      { _id: quizId, "questions._id": questionId },
      { $set: { "questions.$": { ...questionUpdates, _id: questionId } } }
    );
  }

  // Delete a question from a quiz
  function deleteQuestion(quizId, questionId) {
    return model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } }
    );
  }

  return {
    findQuizzesForCourse,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    findQuizById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
