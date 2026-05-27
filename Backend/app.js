import express from "express";
import dotenv from "dotenv";
import studentRouter from "./routes/student.route.js";
import teacherRouter from "./routes/teacher.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import connectDB from "./db/db.js";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config({ path: "./Backend/.env" });
const PORT = process.env.PORT;

//* Deployment steps
const __dirname = path.resolve();
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "Frontend/dist")));

  app.get(/^(?!\/api).*/, (req, res) => {
    // app.get("/*splat", (req, res) => {
    res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
  });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teacher", teacherRouter);

// first connected to db then listening to the port
connectDB()
  .then(() => {
    console.log("Connected to db");
    app.listen(PORT, (req, res) => {
      console.log(`connected to port ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Failed to connected to database ${err.message}`),
  );
