import * as dao from "./dao.js";

export default function PiazzaRoutes(app) {
  // Posts
  const findPostsForCourse = async (req, res) => {
    const { cid } = req.params;
    const { folder } = req.query;
    let posts = await dao.findPostsForCourse(cid);
    if (folder) {
      posts = posts.filter((p) => p.folders.includes(folder));
    }
    res.json(posts);
  };

  const findPostById = async (req, res) => {
    const { postId } = req.params;
    await dao.incrementPostViews(postId);
    const post = await dao.findPostById(postId);
    res.json(post);
  };

  const createPost = async (req, res) => {
    const { cid } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const post = { ...req.body, course: cid, author: currentUser._id };
    const newPost = await dao.createPost(post);
    res.json(newPost);
  };

  const updatePost = async (req, res) => {
    const { postId } = req.params;
    const status = await dao.updatePost(postId, req.body);
    res.json(status);
  };

  const deletePost = async (req, res) => {
    const { postId } = req.params;
    const status = await dao.deletePost(postId);
    res.json(status);
  };

  // Answers
  const addAnswer = async (req, res) => {
    const { postId, answerType } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const answer = { ...req.body, author: currentUser._id };
    if (answerType === "student") {
      await dao.addStudentAnswer(postId, answer);
    } else {
      await dao.addInstructorAnswer(postId, answer);
    }
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const updateAnswer = async (req, res) => {
    const { postId, answerId, answerType } = req.params;
    await dao.updateAnswer(postId, answerId, answerType, req.body);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const deleteAnswer = async (req, res) => {
    const { postId, answerId, answerType } = req.params;
    await dao.deleteAnswer(postId, answerId, answerType);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  // Discussions
  const addDiscussion = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const discussion = { ...req.body, author: currentUser._id };
    await dao.addDiscussion(postId, discussion);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const updateDiscussion = async (req, res) => {
    const { postId, discussionId } = req.params;
    await dao.updateDiscussion(postId, discussionId, req.body);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const deleteDiscussion = async (req, res) => {
    const { postId, discussionId } = req.params;
    await dao.deleteDiscussion(postId, discussionId);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const toggleDiscussionResolved = async (req, res) => {
    const { postId, discussionId } = req.params;
    const { resolved } = req.body;
    await dao.toggleDiscussionResolved(postId, discussionId, resolved);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  // Replies
  const addReply = async (req, res) => {
    const { postId, discussionId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const reply = { ...req.body, author: currentUser._id };
    await dao.addReply(postId, discussionId, reply);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const updateReply = async (req, res) => {
    const { postId, discussionId, replyId } = req.params;
    await dao.updateReply(postId, discussionId, replyId, req.body);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  const deleteReply = async (req, res) => {
    const { postId, discussionId, replyId } = req.params;
    await dao.deleteReply(postId, discussionId, replyId);
    const updatedPost = await dao.findPostById(postId);
    res.json(updatedPost);
  };

  // Folders
  const findFoldersForCourse = async (req, res) => {
    const { cid } = req.params;
    await dao.initializeDefaultFolders(cid);
    const folders = await dao.findFoldersForCourse(cid);
    res.json(folders);
  };

  const createFolder = async (req, res) => {
    const { cid } = req.params;
    const folder = { ...req.body, course: cid };
    const newFolder = await dao.createFolder(folder);
    res.json(newFolder);
  };

  const updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const status = await dao.updateFolder(folderId, req.body);
    res.json(status);
  };

  const deleteFolder = async (req, res) => {
    const { folderId } = req.params;
    const status = await dao.deleteFolder(folderId);
    res.json(status);
  };

  const deleteFolders = async (req, res) => {
    const { folderIds } = req.body;
    const status = await dao.deleteFolders(folderIds);
    res.json(status);
  };

  // Statistics
  const getClassStats = async (req, res) => {
    const { cid } = req.params;
    const stats = await dao.getClassStats(cid);
    res.json(stats);
  };

  // Post routes
  app.get("/api/courses/:cid/posts", findPostsForCourse);
  app.get("/api/posts/:postId", findPostById);
  app.post("/api/courses/:cid/posts", createPost);
  app.put("/api/posts/:postId", updatePost);
  app.delete("/api/posts/:postId", deletePost);

  // Answer routes
  app.post("/api/posts/:postId/answers/:answerType", addAnswer);
  app.put("/api/posts/:postId/answers/:answerType/:answerId", updateAnswer);
  app.delete("/api/posts/:postId/answers/:answerType/:answerId", deleteAnswer);

  // Discussion routes
  app.post("/api/posts/:postId/discussions", addDiscussion);
  app.put("/api/posts/:postId/discussions/:discussionId", updateDiscussion);
  app.delete("/api/posts/:postId/discussions/:discussionId", deleteDiscussion);
  app.put("/api/posts/:postId/discussions/:discussionId/resolve", toggleDiscussionResolved);

  // Reply routes
  app.post("/api/posts/:postId/discussions/:discussionId/replies", addReply);
  app.put("/api/posts/:postId/discussions/:discussionId/replies/:replyId", updateReply);
  app.delete("/api/posts/:postId/discussions/:discussionId/replies/:replyId", deleteReply);

  // Folder routes
  app.get("/api/courses/:cid/folders", findFoldersForCourse);
  app.post("/api/courses/:cid/folders", createFolder);
  app.put("/api/folders/:folderId", updateFolder);
  app.delete("/api/folders/:folderId", deleteFolder);
  app.post("/api/folders/delete-multiple", deleteFolders);

  // Statistics routes
  app.get("/api/courses/:cid/stats", getClassStats);
}