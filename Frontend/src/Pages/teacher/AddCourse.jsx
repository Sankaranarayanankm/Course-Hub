import { ArrowLeft, Edit, Edit2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import convertToBase64 from "../../lib/convertTo64Base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import toast from "react-hot-toast";

const AddCourse = () => {
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState("");
  const [pdf, setPdf] = useState(null);
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  // console.log(pdf);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: authUserId } = queryClient.getQueryData(["authUser"]);

  const { mutate: addCourse, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/teacher/courses", data);
      return response.data;
    },
    onSuccess: (data) => {
      // console.log(data);
      toast.success("Course Added Successfully");
      resetForm();
      navigate("/add-chapter", { state: data.id });
    },
    onError: (err) => console.log(err.message),
  });

  const resetForm = () => {
    setPreview("");
    setImage("");
    setPdf(null);
    setCourseDetails({
      title: "",
      description: "",
      price: "",
      category: "",
    });
  };

  const handleInput = async (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const selectedImage = files[0];
      setPreview(URL.createObjectURL(selectedImage));
      // converting to base 64 to send to backend
      const imageBase64 = await convertToBase64(selectedImage);
      setImage(imageBase64);
      return;
    }
    if (name === "attachments") {
      const selectedFile = files[0];
      // converting to base 64 to send to backend
      const pdfBase64 = await convertToBase64(selectedFile);
      setPdf(pdfBase64);
      return;
    }
    setCourseDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...courseDetails,
      image,
      attachment: pdf,
      teacher: authUserId,
    };
    // console.log(data);
    addCourse(data);
  };

  const InputSection = ({ title, edit, placeholder, value, name }) => {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

            <p className="text-sm text-slate-500 mt-1">
              Update your course {title.toLowerCase()}
            </p>
          </div>

          <p className="flex items-center text-sm text-slate-500 hover:text-black transition">
            <Edit2 size={16} className="mr-1" />
            {edit}
          </p>
        </div>

        {name === "image" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Upload Course Thumbnail
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  JPG, PNG recommended (1:1 or 16:9)
                </p>
              </div>

              <label className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium cursor-pointer hover:opacity-90 transition">
                Choose Image
                <input
                  type="file"
                  name="image"
                  onChange={handleInput}
                  className="hidden"
                />
              </label>
            </div>

            {preview && (
              <div className="flex items-center gap-4 mt-3">
                <img
                  src={preview}
                  alt="preview"
                  className="w-28 h-20 object-cover rounded-xl border border-slate-200"
                />

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Image selected
                  </p>

                  <p className="text-xs text-slate-500">
                    This will be shown as course thumbnail
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : name === "attachments" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Upload Resources (PDF)
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Add notes, assignments or study materials
                </p>
              </div>

              <label className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium cursor-pointer hover:opacity-90 transition">
                Choose PDF
                <input
                  type="file"
                  accept=".pdf"
                  name="attachments"
                  onChange={handleInput}
                  className="hidden"
                />
              </label>
            </div>

            {pdf && (
              <div className="flex items-center gap-4 mt-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                {/* PDF Icon */}
                <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  PDF
                </div>

                {/* File Info */}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {pdf.name}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    File uploaded successfully
                  </p>
                </div>

                {/* Status */}
                <div className="text-xs font-medium text-emerald-600">
                  Ready
                </div>
              </div>
            )}
          </div>
        ) : (
          <input
            type={name === "price" ? "number" : "text"}
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={handleInput}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none focus:ring-2 focus:ring-black transition text-slate-800 placeholder:text-slate-400"
          />
        )}
      </div>
    );
  };

  return (
    <form
      className="flex-1 min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8"
      onSubmit={handleSubmit}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="w-11 h-11 p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-black cursor-pointer transition shadow-sm"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Create New Course
          </h1>

          <p className="text-slate-500 mt-2">
            Add course details, upload resources and prepare your content for
            students.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Course Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Fill in the required information to customize your course
              experience.
            </p>
          </div>

          <div className="space-y-5">
            {InputSection({
              title: "Title",
              placeholder: "Enter course title",
              edit: "Edit Title",
              value: courseDetails.title,
              name: "title",
            })}

            {InputSection({
              title: "Description",
              placeholder: "Enter description",
              edit: "Edit Description",
              value: courseDetails.description,
              name: "description",
            })}

            {InputSection({
              title: "Price",
              placeholder: "Enter course price",
              edit: "Edit Price",
              value: courseDetails.price,
              name: "price",
            })}

            {InputSection({
              title: "Image",
              edit: "Edit Thumbnail",
              value: image,
              name: "image",
            })}

            {InputSection({
              title: "Category",
              placeholder: "Enter category",
              edit: "Edit Category",
              value: courseDetails.category,
              name: "category",
            })}

            {InputSection({
              title: "Resources & Attachments",
              edit: "Upload File",
              value: pdf,
              name: "attachments",
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-200">
            <div>
              <h4 className="font-semibold text-slate-900">
                Ready to continue?
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Proceed to add lessons and chapters.
              </p>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-8 py-4 rounded-2xl font-medium hover:opacity-90 transition shadow-sm"
            >
              {isPending ? "Creating..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddCourse;
