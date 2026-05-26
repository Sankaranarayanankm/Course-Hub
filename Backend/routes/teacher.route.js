import express from "express";
import {
  getTeacherCourseStatusController,
  getTeacherCourseController,
  editCourseController,
  publishCourseController,
  deleteCourseController,
  addChapterController,
  deleteChapterController,
  editChapterController,
  addCourseController,
  getChaptersOfCourse,
  getSingleCourseController,
} from "../controllers/teacher.controller.js";
import { protectRoute, roleMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.use(protectRoute);
router.use(roleMiddleware("teacher"));

// related to course
router.post("/courses", addCourseController);

router.get("/courses", getTeacherCourseController);

router.put("/courses/:courseId", editCourseController);
router.get("/courses/status", getTeacherCourseStatusController);
router.get("/courses/:courseId", getSingleCourseController);

router.patch("/courses/:courseId/publish", publishCourseController);
router.delete("/courses/:courseId", deleteCourseController);

// realted to chapter
router.get("/courses/:courseId/chapters", getChaptersOfCourse);
router.post(
  "/courses/:courseId/chapters",
  upload.single("video"),
  addChapterController,
);
router.delete("/chapters/:chapterId", deleteChapterController);
router.patch("/chapters/:chapterId", editChapterController); // now not added in front end
export default router;
