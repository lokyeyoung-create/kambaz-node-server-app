import express from "express";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import "dotenv/config";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import session from "express-session";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import mongoose from "mongoose";
import QuizzesRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptsRoutes from "./Kambaz/QuizAttempts/routes.js";

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin === "http://localhost:3000") {
        return callback(null, true);
      }

      // Allow ANY Vercel deployment (production or preview)
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      // If none match, block it
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  },
};

if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
}

app.use(session(sessionOptions));
app.use(express.json());
app.get("/api/session-test", (req, res) => {
  console.log("Session test - ID:", req.sessionID);
  console.log("Session test - User:", req.session.currentUser);
  res.json({
    sessionID: req.sessionID,
    hasUser: !!req.session.currentUser,
    user: req.session.currentUser,
  });
});
// Test route
app.get("/api/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Server is working" });
});

console.log("Setting up UserRoutes...");
UserRoutes(app);
console.log("Setting up CourseRoutes...");
CourseRoutes(app);
console.log("Setting up Lab5...");
Lab5(app);
console.log("Setting up AssignmentsRoutes...");
AssignmentsRoutes(app);
console.log("Setting up ModulesRoutes...");
ModulesRoutes(app);
console.log("Setting up EnrollmentsRoutes...");
EnrollmentsRoutes(app);
console.log("Setting up Hello route...");
Hello(app);
QuizzesRoutes(app);
QuizAttemptsRoutes(app);
app.listen(4000, () => {
  console.log("Server is running on port 4000");
  console.log("Test the server at: http://localhost:4000/api/test");
});
