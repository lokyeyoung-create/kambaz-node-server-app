import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  // Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);

  // Create quiz for a course
  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = {
      ...req.body,
      course: courseId,
    };
    const newQuiz = await dao.createQuiz(quiz);
    res.send(newQuiz);
  };
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);

  // Delete quiz
  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };
  app.delete("/api/quizzes/:quizId", deleteQuiz);

  // Update quiz
  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.json(status);
  };
  app.put("/api/quizzes/:quizId", updateQuiz);

  // Get single quiz
  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };
  app.get("/api/quizzes/:quizId", findQuizById);

  // Add question to quiz
  const addQuestionToQuiz = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    const newQuestion = await dao.addQuestion(quizId, question);
    res.json(newQuestion);
  };
  app.post("/api/quizzes/:quizId/questions", addQuestionToQuiz);

  // Update question in quiz
  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    const status = await dao.updateQuestion(
      quizId,
      questionId,
      questionUpdates
    );
    res.json(status);
  };
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);

  // Delete question from quiz
  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const status = await dao.deleteQuestion(quizId, questionId);
    res.json(status);
  };
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}
