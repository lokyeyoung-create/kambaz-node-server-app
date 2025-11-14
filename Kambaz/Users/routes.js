import UsersDao from "./dao.js";
let currentUser = null;
export default function UserRoutes(app, db) {
  const dao = UsersDao(db);
  const createUser = (req, res) => {};
  const deleteUser = (req, res) => {};
  const findAllUsers = (req, res) => {};
  const findUserById = (req, res) => {};
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // Kambaz/Users/routes.js - Update the signin function
  const signin = (req, res) => {
    console.log("=== SIGNIN DEBUG ===");
    console.log("Request body:", req.body);
    const { username, password } = req.body;
    console.log("Looking for user:", username, "with password:", password);

    const currentUser = dao.findUserByCredentials(username, password);
    console.log(
      "User found:",
      currentUser ? `Yes - ${currentUser.username}` : "No"
    );

    if (currentUser) {
      req.session["currentUser"] = currentUser;
      req.session.save((err) => {
        if (err) {
          console.log("Session save error:", err);
        } else {
          console.log("Session saved successfully");
        }
      });
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
