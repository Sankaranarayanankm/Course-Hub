import cloudinary from "../config/cloudinary.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import Chapter from "../models/chapter.model.js";
import Course from "../models/course.model.js";
import dotenv from "dotenv";
import router from "../routes/student.route.js";
import { uploadToCloudinary } from "../config/multer.js";
import User from "../models/user.model.js";
dotenv.config({ path: "./Backend/.env" });

export const addCourseController = async (req, res) => {
  try {
    // res.send("success");
    const teacherId = req.user.id;
    const { title, description, image, category, attachment, price, chapters } =
      req.body;
    if (!title || !description || !image || !category || !price) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    const cloudinaryImage = await cloudinary.uploader.upload(image);

    const imageURL = cloudinaryImage?.secure_url;
    // console.log(imageURL);
    const courseObj = {
      title,
      description,
      image: imageURL,
      category,
      price,
      teacher: teacherId,
    };

    if (attachment) {
      const pdfURL = await cloudinary.uploader.upload(attachment, {
        resource_type: "raw",
      });
      courseObj["attachment"] = pdfURL.secure_url;
    }
    const newCourse = await Course.create(courseObj);
    await User.findByIdAndUpdate(teacherId, {
      $push: { createdCourses: newCourse._id },
    });
    res.status(201).json({ id: newCourse._id });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in add course controller ${error.message}`,
    });
  }
};

export const getSingleCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate("teacher", "-password -createdAt -updatedAt")
      .populate("chapters");
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to find courses" });
    }
    return res.status(200).json(course);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error in get Single course controller ${err.message}`,
    });
  }
};

export const getTeacherCourseController = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacherCourses = await Course.find({ teacher: teacherId });
    res.status(200).json(teacherCourses);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in get teacher course controller ${error.message}`,
    });
  }
};

export const getTeacherCourseStatusController = async (req, res) => {
  try {
    /**
     * here send total published courses
     * total amount made of all courses
     * total published courses
     */
    const teacherId = req.user.id;
    const teacherCourses = await Course.find({ teacher: teacherId });

    const totalAmountMade = teacherCourses.reduce((acc, course) => {
      return course.purchasedCount !== 0
        ? acc + course.purchasedCount * course.price
        : acc;
    }, 0);

    const totalPurchasedCourse = teacherCourses.reduce((acc, item) => {
      return acc + item.purchasedCount;
    }, 0);

    const purchaseCountObj = {};
    for (let val of teacherCourses) {
      if (val.purchasedCount !== 0) {
        purchaseCountObj[val.title] = val.purchasedCount;
      }
    }
    res.status(200).json({
      totalPurchasedCourse,
      totalAmount: totalAmountMade,
      data: purchaseCountObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in get teacher course status controller ${error.message}`,
    });
  }
};
export const editCourseController = async (req, res) => {
  try {
    const updatedBody = req.body;
    const { courseId } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: updatedBody,
      },
      { returnDocument: "after" },
    );
    res.status(200).json({
      success: true,
      message: "course updated successfull",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in edit course controller ${error.message}`,
    });
  }
};

export const publishCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Cannot find the course" });
    }

    course.isPublished = !course.isPublished;
    await course.save();
    res.status(200).json({ message: "course updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in publish course controller ${error.message}`,
    });
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;
    const course = await Course.findById(courseId);
    console.log(course);
    console.log(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (teacherId !== course.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "you are not allowed to delete this course",
      });
    }
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    console.log(deletedCourse);
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in delete course controller ${error.message}`,
    });
  }
};
export const addChapterController = async (req, res) => {
  try {
    // res.send("success");
    const { courseId } = req.params;
    const { title, description, isFree } = req.body;

    if (!title || !description || !req.file) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are mandatory" });
    }

    //? uploading to cloudinary with multer
    const cloudinaryVideo = await uploadToCloudinary(req.file.buffer);

    // const videoPath = req.file.path;
    // const cloudinaryVideo = await cloudinary.uploader.upload(videoPath, {
    //   resource_type: "video",
    // });
    const videoUrl = cloudinaryVideo.secure_url;

    const newChapter = await Chapter.create({
      title,
      description,
      video: videoUrl,
      isFree: isFree === "true", // since it will be string from frontend
    });
    // link the chapter with course
    await Course.findByIdAndUpdate(courseId, {
      $push: { chapters: newChapter._id },
    });

    res.status(201).json({ id: newChapter._id });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in add chapter controller ${error.message}`,
    });
  }
};
export const deleteChapterController = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found" });
    }
    await Course.updateOne(
      { chapters: chapterId },
      { $pull: { chapters: chapterId } },
    );
    await Chapter.findByIdAndDelete(chapterId);
    return res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in delete chapter controller ${error.message}`,
    });
  }
};
export const editChapterController = async (req, res) => {
  try {
    const updatedBody = req.body;
    const { chapterId } = req.params;
    // update it in the chapter model
    await Chapter.findByIdAndUpdate(chapterId, updatedBody);
    //  since we are adding only id to course model we don't need to update it there
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error in edit chapter controller ${error.message}`,
    });
  }
};

export const getChaptersOfCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  try {
    const course = await Course.findById(courseId).populate(
      "chapters",
      "title id isFree",
    );
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const chapters = course?.chapters;
    res.status(200).json({ success: true, data: chapters });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error in get chapter of course controller ${err.message}`,
    });
  }
};
