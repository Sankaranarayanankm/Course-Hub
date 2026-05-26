import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_COURSES } from "../../data/teacherData";
import { ArrowLeft, Lock } from "lucide-react";
import LoadingScreen from "../../Components/LoadingScreen";
import toast from "react-hot-toast";
import axiosInstance from "../../utls/axios";
import axios from "axios";

const TeacherCourseDetails = () => {
  const [isEditting, setIsEditting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const params = useParams();
  const { courseId } = params;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //* Fetching Course Details
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/teacher/courses/${courseId}`);
      return response.data;
    },
  });
  //* Fetching chapters
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["chapters", courseId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/teacher/courses/${courseId}/chapters`,
      );
      return response.data.data;
    },
  });

  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setCategory(course.category || "");
      setDescription(course.description || "");
      setPrice(course.price || "");
    }
  }, [course]);

  //* Delete Chapter mutation
  const { mutate: deleteChapter } = useMutation({
    mutationFn: async (id) => {
      console.log(id);
      const response = await axiosInstance.delete(`teacher/chapters/${id}`);
      return response;
    },
    onSuccess: () => {
      toast.success("Chapter Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete chapter"),
  });
  //* Edit course mutation
  const { mutate: editCourse, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.put(
        `/teacher/courses/${courseId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Edit Completed");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
    onError: (err) => toast.error(err.message || "Failed to edit Course"),
  });
  if (!course || isLoading || courseLoading) return <LoadingScreen />;

  const handleEditCourse = () => {
    const dataObj = { title, description, category, price };
    if (isEditting) {
      editCourse(dataObj);
    }
    setIsEditting((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="h-11 w-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-100 transition mb-5"
            >
              <ArrowLeft size={20} />
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
              Course Details
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your course information, chapters and learning content.
            </p>
          </div>

          <button
            onClick={handleEditCourse}
            className="px-6 py-3 rounded-2xl bg-black text-white font-medium hover:opacity-90 transition shadow-sm"
          >
            {isEditting ? "Save Changes" : "Edit Course"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_420px] gap-6">
          {/* LEFT SECTION */}
          <div className="space-y-6">
            {/* Course Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              {/* Image */}
              <img
                src={course?.image}
                alt={course?.title}
                className="w-full h-60 md:h-80 "
              />

              <div className="p-6 md:p-8">
                {/* Title */}
                <div className="mb-8">
                  <p className="text-sm text-slate-500 mb-2">Course Title</p>

                  {isEditting ? (
                    <input
                      type="text"
                      placeholder="Enter course title"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:ring-2 focus:ring-black transition text-slate-800"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-slate-900">
                      {course?.title}
                    </h2>
                  )}
                </div>

                {/* Category + Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                    <p className="text-sm text-slate-500 mb-2">Category</p>

                    {isEditting ? (
                      <input
                        type="text"
                        placeholder="Edit category"
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold capitalize text-slate-900">
                        {course?.category}
                      </h3>
                    )}
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5">
                    <p className="text-sm text-slate-500 mb-2">Price</p>

                    {isEditting ? (
                      <input
                        type="text"
                        placeholder="Edit price"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-slate-900">
                        ₹{course?.price}
                      </h3>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    About this Course
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 mb-5">
                    Update your course information and learning details.
                  </p>

                  {isEditting ? (
                    <textarea
                      rows={5}
                      placeholder="Edit description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      className="w-full rounded-[2rem] border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  ) : (
                    <p className="text-slate-600 leading-8">
                      {course?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div>
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Chapters
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Organize course lessons and videos
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/add-chapter", {
                      state: courseId,
                    })
                  }
                  className="px-5 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition font-medium"
                >
                  Add Chapter
                </button>
              </div>

              {chapters.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 border border-slate-200 py-14 px-5 text-center">
                  <h4 className="text-lg font-semibold text-slate-800">
                    No chapters added
                  </h4>

                  <p className="text-slate-500 mt-2">
                    Start building your course by adding lessons and videos.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {chapters?.map((item) => (
                    <li
                      key={item._id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {!item.isFree && (
                            <div className="h-9 w-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                              <Lock size={16} />
                            </div>
                          )}

                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {item.title}
                            </h4>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.isFree
                                ? "Free preview chapter"
                                : "Premium course chapter"}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteChapter(item._id)}
                          className="px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseDetails;
