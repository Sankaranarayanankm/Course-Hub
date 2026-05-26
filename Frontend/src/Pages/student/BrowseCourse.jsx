import React, { useEffect, useState } from "react";
import CourseCard from "../../Components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios.js";
import LoadingScreen from "../../Components/LoadingScreen.jsx";
import { Search } from "lucide-react";

const BrowseCourse = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const { data: courses, isLoading } = useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/student/courses");
      return response.data.filter((course) => course.isPublished);
    },
  });
  useEffect(() => {
    if (courses) {
      setFilteredCourses(courses);
    }
  }, [courses]);

  const categories = [
    ...new Set(courses?.map((item) => item.category.toLowerCase())),
  ];

  const handleInput = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    const updatedCourses = courses.filter((course) =>
      course.title
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(searchTerm)),
    );

    setFilteredCourses(updatedCourses);
  };

  const handleFilterCategory = (category) => {
    const updatedCourses = courses.filter(
      (course) => course.category.toLowerCase() === category,
    );
    setFilteredCourses(updatedCourses);
  };

  if (isLoading) return <LoadingScreen />;
  const purchasedCourses = courses?.filter((course) => course.isPurchased);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Browse Courses</h1>

        <p className="text-slate-500 mt-2">Explore and continue learning.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Total Courses</p>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {courses?.length}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Published courses available
          </p>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6">
          <p className="text-sm text-slate-500">Purchased Courses</p>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {purchasedCourses?.length}
          </h2>

          <p className="text-sm text-slate-400 mt-2">Courses you enrolled in</p>
        </div>
      </div>
      {/* Search  */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={handleInput}
          placeholder="Search your courses..."
          className="w-full  pl-12 pr-4 py-3 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-black transition"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setFilteredCourses(courses)}
          className="px-5 py-2 rounded-full bg-black text-white hover:opacity-90 transition text-sm font-medium"
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item}
            onClick={() => handleFilterCategory(item)}
            className="px-5 py-2 rounded-full bg-white border border-slate-300 hover:border-black hover:bg-slate-50 transition text-sm capitalize"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Available Courses
          </h2>

          <span className="text-sm text-slate-500">
            {courses?.length} courses
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredCourses?.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseCourse;
