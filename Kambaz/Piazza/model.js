import mongoose from "mongoose";
import { postSchema, folderSchema } from "./schema.js";

export const PostModel = mongoose.model("PostModel", postSchema);
export const FolderModel = mongoose.model("FolderModel", folderSchema);

export default { PostModel, FolderModel };