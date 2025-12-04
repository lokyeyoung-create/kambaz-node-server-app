import { v4 as uuidv4 } from "uuid";
import { PostModel, FolderModel } from "./model.js";

// Posts
export const findPostsForCourse = (courseId) => {
  return PostModel.find({ course: courseId }).sort({ createdAt: -1 });
};

export const findPostById = (postId) => {
  return PostModel.findOne({ _id: postId });
};

export const createPost = async (post) => {
  const newPost = { ...post, _id: uuidv4(), createdAt: new Date() };
  return PostModel.create(newPost);
};

export const updatePost = (postId, updates) => {
  return PostModel.updateOne({ _id: postId }, { $set: updates });
};

export const deletePost = (postId) => {
  return PostModel.deleteOne({ _id: postId });
};

export const incrementPostViews = (postId) => {
  return PostModel.updateOne({ _id: postId }, { $inc: { views: 1 } });
};

// Answers
export const addStudentAnswer = async (postId, answer) => {
  const newAnswer = { ...answer, _id: uuidv4(), createdAt: new Date() };
  return PostModel.updateOne({ _id: postId }, { $push: { studentAnswers: newAnswer } });
};

export const addInstructorAnswer = async (postId, answer) => {
  const newAnswer = { ...answer, _id: uuidv4(), createdAt: new Date() };
  return PostModel.updateOne({ _id: postId }, { $push: { instructorAnswers: newAnswer } });
};

export const updateAnswer = (postId, answerId, answerType, updates) => {
  const field = answerType === "student" ? "studentAnswers" : "instructorAnswers";
  return PostModel.updateOne(
    { _id: postId, [`${field}._id`]: answerId },
    { $set: { [`${field}.$.content`]: updates.content } }
  );
};

export const deleteAnswer = (postId, answerId, answerType) => {
  const field = answerType === "student" ? "studentAnswers" : "instructorAnswers";
  return PostModel.updateOne({ _id: postId }, { $pull: { [field]: { _id: answerId } } });
};

// Followup Discussions
export const addDiscussion = async (postId, discussion) => {
  const newDiscussion = { ...discussion, _id: uuidv4(), replies: [], createdAt: new Date() };
  return PostModel.updateOne({ _id: postId }, { $push: { followupDiscussions: newDiscussion } });
};

export const updateDiscussion = (postId, discussionId, updates) => {
  return PostModel.updateOne(
    { _id: postId, "followupDiscussions._id": discussionId },
    { $set: { "followupDiscussions.$.content": updates.content, "followupDiscussions.$.resolved": updates.resolved } }
  );
};

export const deleteDiscussion = (postId, discussionId) => {
  return PostModel.updateOne({ _id: postId }, { $pull: { followupDiscussions: { _id: discussionId } } });
};

export const toggleDiscussionResolved = (postId, discussionId, resolved) => {
  return PostModel.updateOne(
    { _id: postId, "followupDiscussions._id": discussionId },
    { $set: { "followupDiscussions.$.resolved": resolved } }
  );
};

// Replies
export const addReply = async (postId, discussionId, reply) => {
  const newReply = { ...reply, _id: uuidv4(), createdAt: new Date() };
  return PostModel.updateOne(
    { _id: postId, "followupDiscussions._id": discussionId },
    { $push: { "followupDiscussions.$.replies": newReply } }
  );
};

export const updateReply = (postId, discussionId, replyId, updates) => {
  return PostModel.updateOne(
    { _id: postId },
    { $set: { "followupDiscussions.$[d].replies.$[r].content": updates.content } },
    { arrayFilters: [{ "d._id": discussionId }, { "r._id": replyId }] }
  );
};

export const deleteReply = (postId, discussionId, replyId) => {
  return PostModel.updateOne(
    { _id: postId, "followupDiscussions._id": discussionId },
    { $pull: { "followupDiscussions.$.replies": { _id: replyId } } }
  );
};

// Folders
export const findFoldersForCourse = (courseId) => {
  return FolderModel.find({ course: courseId }).sort({ createdAt: 1 });
};

export const createFolder = async (folder) => {
  const newFolder = { ...folder, _id: uuidv4(), createdAt: new Date() };
  return FolderModel.create(newFolder);
};

export const updateFolder = (folderId, updates) => {
  return FolderModel.updateOne({ _id: folderId }, { $set: updates });
};

export const deleteFolder = (folderId) => {
  return FolderModel.deleteOne({ _id: folderId });
};

export const deleteFolders = (folderIds) => {
  return FolderModel.deleteMany({ _id: { $in: folderIds } });
};

export const initializeDefaultFolders = async (courseId) => {
  const defaultFolders = ["hw1", "hw2", "hw3", "hw4", "hw5", "hw6", "project", "exam", "logistics", "other", "office_hours"];
  const existingFolders = await FolderModel.find({ course: courseId });
  if (existingFolders.length === 0) {
    const folders = defaultFolders.map((name) => ({ _id: uuidv4(), course: courseId, name, createdAt: new Date() }));
    return FolderModel.insertMany(folders);
  }
  return existingFolders;
};

// Statistics
export const getClassStats = async (courseId) => {
  const posts = await PostModel.find({ course: courseId });
  const totalPosts = posts.length;
  const unansweredQuestions = posts.filter((p) => p.type === "question" && p.studentAnswers.length === 0 && p.instructorAnswers.length === 0).length;
  const instructorResponses = posts.reduce((sum, p) => sum + p.instructorAnswers.length, 0);
  const studentResponses = posts.reduce((sum, p) => sum + p.studentAnswers.length, 0);
  return { totalPosts, unansweredQuestions, instructorResponses, studentResponses };
};