import express from "express";
import {
  editProfileController,
  getProfileController,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.put("/me", protectRoute, editProfileController);
router.get("/me", protectRoute, getProfileController);
   
export default router;
