import Course from "../models/course.model.js";
import Progress from "../models/progress.model.js";
import User from "../models/user.model.js";

export const getAllCourseController = async (req, res) => {
  try {
    const courses = await Course.find().populate("chapters");
    const studentId = req.user.id;
    const user = await User.findById(studentId);
    const progress = await Progress.find({ student: studentId });
    const set = new Set();
    for (let item of progress) {
      for (let chapter of item.chaptersCompleted) {
        set.add(chapter.toString());
      }
    }

    const purchasedSet = new Set(
      user.purchasedCourses.map((id) => id.toString()),
    );

    const updatedCourses = courses.map((course) => {
      const isPurchased = purchasedSet.has(course._id.toString());
      const updatedChapters = course.chapters.map((chapter) => ({
        ...chapter.toObject(),
        isCompleted: set.has(chapter._id.toString()),
      }));

      const completedChapters = updatedChapters.filter((chapter) => {
        return set.has(chapter._id.toString());
      });

      return {
        ...course.toObject(),
        chapters: updatedChapters,
        isPurchased,
        completedChapters,
      };
    });

    res.status(200).json(updatedCourses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// export const getStudentCourseController = async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const student = await User.findById(studentId).populate("purchasedCourses");
//     if (!student) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Failed to find student" });
//     }
//     const studentCourses = student.purchasedCourses.map((course) => {
//       return {
//         ...course.toObject(),
//         isPurchased: true,
//       };
//     });
//     console.log(studentCourses);
//     res.status(200).json(studentCourses);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: `Error in get Student course controller ${err.message}`,
//     });
//   }
// };

export const purchaseCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "course not found", success: false });
    }
    if (!course.isPublished) {
      return res
        .status(400)
        .json({ success: false, message: "Course is not published yet" });
    }
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "student not found" });
    }
    const alreadyPurchased = student.purchasedCourses.includes(courseId);
    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "Your already purchased this course",
      });
    }
    const purchaseCourse = await Progress.create({
      student: studentId,
      course: courseId,
    });
    student.purchasedCourses.push(courseId);
    course.purchasedCount = course.purchasedCount + 1;
    await course.save();
    await student.save();

    return res.status(200).json({
      message: "Course successfully purchaed",
      success: true,
      data: purchaseCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getProgressOfCourseController = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;
    const courseProgress = await Progress.findOne({
      student: studentId,
      course: courseId,
    });
    if (!courseProgress) {
      return res
        .status(404)
        .json({ success: false, message: " progress not found" });
    }
    res.json(courseProgress);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProgressOfCourseController = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const studentId = req.user.id;
    const currentProgress = await Progress.findOne({
      student: studentId,
      course: courseId,
    });
    // console.log(courseId, "course id");
    // console.log(chapterId, "chapter id");
    if (!currentProgress) {
      return res
        .status(404)
        .json({ success: false, message: "Unable to find the course" });
    }
    const alreadyCompleted =
      currentProgress.chaptersCompleted.includes(chapterId);
    // console.log(alreadyCompleted, "already completed");
    if (!alreadyCompleted) {
      currentProgress.chaptersCompleted.push(chapterId);
      await currentProgress.save();
    }
    // console.log(currentProgress);
    return res.status(200).json({ success: true, message: "updated progress" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
