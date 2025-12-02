import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  // Get all assignments for a course
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);

  // Create assignment for a course
  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = await dao.createAssignment(assignment);
    res.send(newAssignment);
  };
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);

  // Delete assignment
  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.json(status);
  };
  app.delete("/api/assignments/:assignmentId", deleteAssignment);

  // Update assignment
  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
    res.json(status);
  };
  app.put("/api/assignments/:assignmentId", updateAssignment);

  // Get single assignment
  const findAssignmentById = async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await dao.findAssignmentById(assignmentId);
    res.json(assignment);
  };
  app.get("/api/assignments/:assignmentId", findAssignmentById);
}
