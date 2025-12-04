import QuizAttemptsDao from "./dao.js";

export default function QuizAttemptsRoutes(app) {
  const dao = QuizAttemptsDao();

  // Submit a quiz attempt
  const submitQuizAttempt = async (req, res) => {
    const { quizId } = req.params;
    const { userId, answers, score, course } = req.body;

    const attemptCount = await dao.countAttempts(userId, quizId);

    const attempt = {
      quiz: quizId,
      user: userId,
      course,
      attemptNumber: attemptCount + 1,
      answers,
      score,
    };

    const newAttempt = await dao.createAttempt(attempt);
    res.send(newAttempt);
  };
  app.post("/api/quizzes/:quizId/attempts", submitQuizAttempt);

  // Get attempts for a quiz by a user
  const getAttemptsByUserAndQuiz = async (req, res) => {
    const { quizId, userId } = req.params;
    const attempts = await dao.findAttemptsByUserAndQuiz(userId, quizId);
    res.json(attempts);
  };
  app.get("/api/quizzes/:quizId/attempts/:userId", getAttemptsByUserAndQuiz);

  // Get latest attempt
  const getLatestAttempt = async (req, res) => {
    const { quizId, userId } = req.params;
    const attempt = await dao.findLatestAttempt(userId, quizId);
    res.json(attempt);
  };
  app.get("/api/quizzes/:quizId/attempts/:userId/latest", getLatestAttempt);
}
