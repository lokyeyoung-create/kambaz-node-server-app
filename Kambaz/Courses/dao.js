import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  // In Kambaz/Courses/dao.js
  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    console.log("DAO: Finding courses for user:", userId);
    console.log("DAO: Total courses in DB:", courses.length);
    console.log("DAO: Total enrollments in DB:", enrollments.length);

    const userEnrollments = enrollments.filter((e) => e.user === userId);
    console.log("DAO: User enrollments:", userEnrollments);

    const enrolledCourses = courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
    console.log("DAO: Enrolled courses found:", enrolledCourses.length);

    return enrolledCourses;
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  function findAllCourses() {
    return db.courses;
  }
  function deleteCourse(courseId) {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
  }
  function updateCourse(courseId, courseUpdates) {
    const { courses } = db;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
