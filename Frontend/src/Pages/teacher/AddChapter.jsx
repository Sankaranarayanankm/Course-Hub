import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utls/axios";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowLeftIcon } from "lucide-react";

const AddChapter = () => {
  //? This is how we pass data through navigate hook
  //? Use navigate and uselocation hook together for that
  const location = useLocation();
  const courseId = location.state;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [video, setVideo] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  console.log(courseId);
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsFree(false);
    setVideo("");
  };
  const { mutate: addChapter, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        `/teacher/courses/${courseId}/chapters`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Chapter added successfully");

      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      resetForm();
    },
    onError: (err) => toast.error(err.message || "Failed to add chapter"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isFree", isFree);
    formData.append("video", video);

    addChapter(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="w-11 h-11 p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-black cursor-pointer transition shadow-sm"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Create New Chapter
          </h1>

          <p className="text-slate-500 mt-2">
            Add video lessons and structure your course content.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Chapter Details</h2>

          {/* Title */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Title</p>

            <input
              type="text"
              value={title}
              placeholder="Enter chapter title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Description
            </p>

            <textarea
              rows={5}
              value={description}
              placeholder="Explain what students will learn..."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:ring-2 focus:ring-black resize-none transition"
            />
          </div>

          {/* Free Toggle */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div>
              <p className="font-medium text-slate-800">Free Preview Chapter</p>

              <p className="text-sm text-slate-500 mt-1">
                Allow students to access this chapter without purchase
              </p>
            </div>

            <input
              type="checkbox"
              checked={isFree}
              onChange={() => setIsFree((prev) => !prev)}
              className="w-5 h-5 cursor-pointer accent-black"
            />
          </div>

          {/* Video Upload + Preview */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Video Lesson
            </p>

            {!video ? (
              // 🔹 Upload Section
              <label className="flex items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition px-5 py-10 cursor-pointer">
                <div className="text-center">
                  <p className="font-medium text-slate-700">
                    Upload Chapter Video
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Click to upload MP4, MOV or WebM
                  </p>
                </div>

                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  className="hidden"
                />
              </label>
            ) : (
              // 🔹 Preview Section
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Chapter Video Ready
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      You can preview or replace this video
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVideo(null)}
                    className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>

                {/* Video Player */}
                <video
                  controls
                  className="w-full max-h-[320px] object-cover bg-black"
                >
                  <source src={URL.createObjectURL(video)} type={video.type} />
                </video>

                {/* Footer Info */}
                <div className="p-4 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{video.name}</p>

                  <p className="text-xs font-medium text-emerald-600">
                    Ready to publish
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-2xl font-medium hover:opacity-90 transition shadow-sm"
            >
              {isPending ? "Publishing..." : "Publish Chapter"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddChapter;
