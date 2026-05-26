import express from "express";
import {
  purchaseCourseController,
  getAllCourseController,
  getProgressOfCourseController,
  updateProgressOfCourseController,
} from "../controllers/student.controller.js";
import { protectRoute, roleMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.use(roleMiddleware("student"));

router.get("/courses", getAllCourseController);
// router.get("/courses/purchased", getStudentCourseController);

router.post("/purchase/:courseId", purchaseCourseController);
// router.patch("/complete/:chapterId", markAsCompleteController);

router.get("/progress/:courseId", getProgressOfCourseController);
router.put(
  "/progress/:courseId/:chapterId",
  updateProgressOfCourseController,
);

export default router;
