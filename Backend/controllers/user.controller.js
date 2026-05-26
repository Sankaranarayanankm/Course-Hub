import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password -createdAt -updatedAt")
      .populate("purchasedCourses")
      .populate("createdCourses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in get profile controller ${error.message}`,
    });
  }
};

export const editProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;
    const updatedData = {};
    if (name) updatedData.name = name;
    if (password) {
      const salt =await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }
    console.log(updatedData);
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { returnDocument: "after" },
    ).select("-password -createdAt -updatedAt");
    console.log(user);
    res.status(200).json({ success: true, message: "update successful", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in login-controller ${error.message}`,
    });
  }
};
