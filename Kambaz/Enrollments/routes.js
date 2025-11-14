import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);

  // Enroll in a course
  const enrollInCourse = (req, res) => {
    const { userId, courseId } = req.body;
    dao.enrollUserInCourse(userId, courseId);
    res.sendStatus(200);
  };
  app.post("/api/enrollments", enrollInCourse);

  // Unenroll from a course
  const unenrollFromCourse = (req, res) => {
    const { userId, courseId } = req.params;
    dao.unenrollUserFromCourse(userId, courseId);
    res.sendStatus(200);
  };
  app.delete("/api/enrollments/:userId/:courseId", unenrollFromCourse);

  // GET enrollments for a specific user - THIS WAS MISSING!
  const getEnrollmentsForUser = (req, res) => {
    const { userId } = req.params;
    console.log("Getting enrollments for user:", userId);
    const enrollments = dao.findEnrollmentsForUser(userId);
    console.log("Found enrollments:", enrollments);
    res.json(enrollments);
  };
  app.get("/api/enrollments/user/:userId", getEnrollmentsForUser);

  // Get all enrollments (optional, for admin purposes)
  const getAllEnrollments = (req, res) => {
    const { enrollments } = db;
    res.json(enrollments);
  };
  app.get("/api/enrollments", getAllEnrollments);
}
