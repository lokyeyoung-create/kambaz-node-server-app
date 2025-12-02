import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {
  // Find all assignments for a course
  function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  // Create a new assignment
  function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  }

  // Delete an assignment
  function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  // Update an assignment
  function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  }

  // Find a single assignment by ID
  function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
    findAssignmentById,
  };
}
