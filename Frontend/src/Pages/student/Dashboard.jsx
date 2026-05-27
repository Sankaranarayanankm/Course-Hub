import React, { useEffect, useState } from "react";
import CourseCard from "../../Components/CourseCard";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import { Search, BookOpen, Layers } from "lucide-react";
import LoadingScreen from "../../Components/LoadingScreen";

const Dashboard = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axiosInstance.get("/student/courses");
      console.log(response, "This is the response of courses in dashboard");
      return response.data.filter((course) => course.isPurchased);
    },
  });
  // console.log(courses);
  if (isLoading) return <LoadingScreen />;
  const categories = [
    ...new Set(courses?.map((item) => item.category.toLowerCase())),
  ];

  console.log(courses, "Courses in dashboard");
  return (
    <div className="flex-1 min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Learning Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Continue learning and manage your enrolled courses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Purchased Courses</p>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {courses?.length}
              </h2>
            </div>

            <div className="bg-black text-white p-4 rounded-2xl">
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Categories</p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {categories.length}
              </h2>
            </div>

            <div className="bg-black text-white p-4 rounded-2xl">
              <Layers size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          My Learning
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Continue learning from your purchased courses
        </p>
      </div>
      {courses?.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {courses?.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">
            No courses found
          </h3>

          <p className="text-slate-500 mt-2">
            Try searching with another keyword
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
