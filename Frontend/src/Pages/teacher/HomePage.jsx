import React, { useEffect, useState } from "react";
import { ArrowUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import toast from "react-hot-toast";
import LoadingScreen from "../../Components/LoadingScreen";

const HomePage = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState({ price: "asc", status: "asc" });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/teacher/courses");
      console.log(response, "This is the response of courses in home page");

      return response?.data;
    },
  });
  console.log(courses, "This is courses from home page of teacher");
  const { mutate: deleteCourse, isPending } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/teacher/courses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Course Deleted");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete Course"),
  });

  const deleteHandler = (e, id) => {
    e.stopPropagation();
    deleteCourse(id);
  };

  /**
   *! Note
   *  ?This is because the react query stores data in a cache, so array will have same reference untill the data changes
   * ?so it wont re-render
   */
  useEffect(() => {
    if (courses) setFilteredCourses(courses);
  }, [courses]);
  if (isLoading) return <LoadingScreen />;

  const searchFilter = (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setSearch(searchTerm);
    const updatedCourses = courses?.filter((course) =>
      course.title
        .toLowerCase()
        .split(" ")
        .some((word) => word.startsWith(searchTerm)),
    );
    setFilteredCourses(updatedCourses);
  };

  const sortCourses = (type) => {
    let updatedCourses = [...filteredCourses];
    if (type === "price") {
      updatedCourses = filteredCourses.sort((a, b) =>
        sortOrder.price == "asc" ? a?.price - b?.price : b?.price - a?.price,
      );
    } else {
      updatedCourses = filteredCourses.sort((a, b) =>
        sortOrder.status == "asc"
          ? a?.status?.localeCompare(b.status)
          : b?.status?.localeCompare(a.status),
      );
    }
    setFilteredCourses(updatedCourses);
    setSortOrder((prev) => {
      return { ...prev, [type]: prev[type] === "asc" ? "dec" : "asc" };
    });
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>

        <p className="text-slate-500 mt-2">
          Create, organize and manage your courses for students.
        </p>
      </div>

      {/* Search + Action */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
          <div className="w-full lg:w-[360px]">
            <input
              type="search"
              value={search}
              onChange={searchFilter}
              placeholder="Search your courses..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          <button
            onClick={() => navigate("/new-course")}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition font-medium shadow-sm"
          >
            <Plus size={18} />
            Create Course
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your Courses
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Manage videos, chapters and course information.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {courses.length} courses
          </span>
        </div>
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        {courses.length === 0 ? (
          <div className="py-20 text-center px-4">
            <h3 className="text-2xl font-semibold text-slate-800">
              No courses created yet
            </h3>

            <p className="text-slate-500 mt-2">
              Start building your first course and share knowledge with
              students.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-5 font-semibold text-slate-700">
                    Course Title
                  </th>

                  <th className="px-6 py-5 font-semibold text-slate-700">
                    <div
                      onClick={() => sortCourses("price")}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      Price
                      <ArrowUpDown size={16} className="text-slate-500" />
                    </div>
                  </th>

                  <th className="px-6 py-5 font-semibold text-slate-700">
                    <div
                      onClick={() => sortCourses("status")}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      Status
                      <ArrowUpDown size={16} className="text-slate-500" />
                    </div>
                  </th>

                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => navigate(`/teacher/courses/${item._id}`)}
                    className="border-b border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {item.title}
                        </h4>

                        <p className="text-sm text-slate-500 mt-1">
                          Manage chapters, videos and course content
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700 font-medium">
                      ₹{item.price}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          item.isPublished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={(e) => deleteHandler(e, item._id)}
                        className="px-4 py-2 rounded-xl border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
