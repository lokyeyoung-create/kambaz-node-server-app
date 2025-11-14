import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  };
  app.get("/api/courses", findAllCourses);
  // In Kambaz/Courses/routes.js
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    console.log("Finding courses for userId:", userId);

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      console.log("Current user from session:", currentUser);

      if (!currentUser) {
        res.sendStatus(401);
        return;
      }

      // If user is FACULTY, ADMIN, or TA, return ALL courses
      if (
        currentUser.role === "FACULTY" ||
        currentUser.role === "ADMIN" ||
        currentUser.role === "TA"
      ) {
        const allCourses = dao.findAllCourses();
        console.log("Returning all courses for faculty:", allCourses.length);
        res.json(allCourses);
        return;
      }

      // For students, return only enrolled courses
      userId = currentUser._id;
      console.log("Student user, getting enrolled courses for ID:", userId);
    }

    const courses = dao.findCoursesForEnrolledUser(userId);
    console.log("Found enrolled courses:", courses.length);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  const enrollmentsDao = EnrollmentsDao(db);
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);
  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  };
  app.delete("/api/courses/:courseId", deleteCourse);
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };
  app.put("/api/courses/:courseId", updateCourse);
}
