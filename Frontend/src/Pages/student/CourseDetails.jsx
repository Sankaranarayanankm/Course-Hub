import React, { useEffect, useState } from "react";
import { DUMMY_COURSES } from "../../data/teacherData";
import { data, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, Play } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import LoadingScreen from "../../Components/LoadingScreen";
import toast from "react-hot-toast";
import { stripePromise } from "../../utls/stripe";

/**
 * Make image editable in course edit section
 * remove demo account courses from db
 * deployment
 */

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapterId, setChapterId] = useState("");
  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/student/courses");
      return response.data;
    },
  });

  const course = courses?.find((course) => course._id == courseId);

  useEffect(() => {
    if (course) {
      setChapterId(course?.chapters[0]?._id);
    }
  }, [course]);

  const { mutate: purchaseCourse, isPending: purchasing } = useMutation({
    mutationFn: async ({ courseId, name, price }) => {
      const data = { courseId, name, price };

      const response = await axiosInstance.post(
        `student/purchase/${courseId}`,
        data,
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      window.location.href = data?.url;
      // console.log(stripe);
      // toast.success("Course Purchased Successfully");
      // queryClient.invalidateQueries(["student-courses"]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to purchase");
      console.log(err.message);
    },
  });

  const { mutate: markAsComplete, isPending } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.put(
        `/student/progress/${courseId}/${id}`,
      );
      return response.data;
    },
    onError: (err) => toast.error(err.message || "Failed to mark as complete"),
    onSuccess: () => {
      toast.success("marked as complete");
      queryClient.invalidateQueries({ queryKey: ["student-courses"] });
    },
  });
  const chapters = course?.chapters;
  const chapter = chapters?.find((item) => item._id == chapterId);
  const canAccess = course?.isPurchased || chapter?.isFree;
  const progress =
    course?.completedChapters.length == 0
      ? 0
      : Math.floor(
          (course?.chapters.length / course?.completedChapters.length) * 100,
        );
  if (isLoading) return <LoadingScreen />;
  console.log(course, "this is course from course details page");
  const handleChapter = (e, item) => {
    e.stopPropagation();
    setChapterId(item?._id);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-screen bg-slate-100 p-4 md:p-6">
      {/* LEFT SIDEBAR */}
      <div className="w-full xl:w-[320px] xl:sticky xl:top-6 h-fit">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-black to-slate-800 text-white">
            <h3 className="text-2xl font-bold break-words">{course?.title}</h3>

            <p className="text-sm text-slate-300 mt-2">{progress}% completed</p>
          </div>

          {/* Chapters */}
          <div className="p-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
            {chapters?.map((item) => {
              const chapterAccess = item?.isFree || course?.isPurchased;

              const isActive = chapterId === item._id;

              return (
                <li
                  key={item._id}
                  onClick={(e) => chapterAccess && handleChapter(e, item)}
                  className={`list-none flex items-start gap-3 rounded-2xl p-4 border transition-all duration-200 ${
                    isActive
                      ? "bg-black text-white border-black shadow-md"
                      : chapterAccess
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 cursor-pointer"
                        : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {chapterAccess ? (
                      <Play
                        size={18}
                        className={isActive ? "text-white" : "text-emerald-600"}
                      />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium break-words">
                      {item?.title}
                    </span>

                    <span
                      className={`text-xs mt-1 ${
                        isActive ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {chapterAccess ? "Available" : "Locked"}
                    </span>
                  </div>
                </li>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-slate-200">
            <button
              onClick={() => navigate(-1)}
              className="h-11 w-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p className="text-sm text-slate-500">Current Chapter</p>

              <h2 className="font-bold text-xl md:text-2xl">
                {chapter?.title}
              </h2>
            </div>
          </div>

          {/* Video */}
          <div className="p-4 md:p-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-lg">
              <video
                src={canAccess ? chapter?.video : null}
                controls={canAccess}
                className={`w-full aspect-video object-cover ${
                  !canAccess ? "opacity-40" : ""
                }`}
              />

              {!canAccess && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white px-4 text-center">
                  <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
                    <Lock size={36} />
                  </div>

                  <h3 className="text-2xl font-bold">Chapter Locked</h3>

                  <p className="text-slate-300 mt-2 max-w-sm">
                    Purchase this course to unlock all chapters and downloadable
                    resources.
                  </p>
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-6">
              <div>
                <h4 className="text-2xl font-bold text-slate-900">
                  {chapter?.title}
                </h4>

                <p className="text-slate-500 text-sm mt-1">
                  Learn step-by-step with hands-on lessons.
                </p>
              </div>
              {/* {console.log(chapter?.isCompleted)} */}
              {course.isPurchased ? (
                <button
                  disabled={chapter?.isCompleted}
                  onClick={() => markAsComplete(chapterId)}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-md"
                >
                  {chapter?.isCompleted ? "Completed" : "Mark as Complete"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    purchaseCourse({
                      courseId,
                      name: course?.title,
                      price: course?.price,
                    })
                  }
                  className="px-8 py-4 rounded-2xl bg-black text-white font-medium hover:opacity-90 transition shadow-md"
                >
                  Enroll ₹{course?.price}
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h5 className="font-semibold text-lg mb-3">About this chapter</h5>

              <p className="text-slate-600 leading-8">
                {canAccess
                  ? chapter?.description
                  : "Purchase this course to unlock detailed chapter explanations and premium learning content."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RESOURCE CARD */}
      {course?.isPurchased && course?.attachment && (
        <div className="w-full xl:w-[300px]">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-lg font-bold text-slate-900">Resources</h4>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Download learning materials
            </p>

            <a
              href={course?.attachment}
              download={course?.title}
              className="flex items-center justify-center rounded-2xl bg-slate-900 text-white py-4 hover:bg-black transition font-medium"
            >
              Download File
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
