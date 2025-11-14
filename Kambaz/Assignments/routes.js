import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // Get all assignments for a course
  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);

  // Create assignment for a course
  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = dao.createAssignment(assignment);
    res.send(newAssignment);
  };
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);

  // Delete assignment
  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    dao.deleteAssignment(assignmentId);
    res.sendStatus(200);
  };
  app.delete("/api/assignments/:assignmentId", deleteAssignment);

  // Update assignment
  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = dao.updateAssignment(assignmentId, assignmentUpdates);
    res.send(status);
  };
  app.put("/api/assignments/:assignmentId", updateAssignment);

  // Get single assignment
  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    res.json(assignment);
  };
  app.get("/api/assignments/:assignmentId", findAssignmentById);
}
