import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  _id: String,
  author: { type: String, ref: "UserModel" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const discussionSchema = new mongoose.Schema({
  _id: String,
  author: { type: String, ref: "UserModel" },
  content: String,
  resolved: { type: Boolean, default: false },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

const answerSchema = new mongoose.Schema({
  _id: String,
  author: { type: String, ref: "UserModel" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

export const postSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    type: { type: String, enum: ["question", "note"], default: "question" },
    postTo: { type: String, enum: ["entire_class", "individual"], default: "entire_class" },
    visibleTo: [{ type: String, ref: "UserModel" }],
    folders: [String],
    summary: { type: String, maxLength: 100, required: true },
    details: { type: String, required: true },
    author: { type: String, ref: "UserModel" },
    views: { type: Number, default: 0 },
    studentAnswers: [answerSchema],
    instructorAnswers: [answerSchema],
    followupDiscussions: [discussionSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "posts" }
);

export const folderSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    name: String,
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "folders" }
);

export default { postSchema, folderSchema };