import React from "react";
import { TEACHER_COURSE_STATUS } from "../../data/teacherData";
import Chart from "../../lib/Chart";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import LoadingScreen from "../../Components/LoadingScreen";

const Analytics = () => {
  const { data: status, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await axiosInstance.get("/teacher/courses/status");
      return response.data;
    },
  });
  if (isLoading) return <LoadingScreen />;

  const chartData = [];
  // console.log(status.data);
  for (let courseData in status.data) {
    const dataObj = {
      title: courseData,
      purchased: status.data[courseData],
    };
    chartData.push(dataObj);
  }
  // console.log(status);

  return (
    <div className="flex-1 min-h-screen bg-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Analytics Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Track your earnings, sales performance and course purchase activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Total Revenue</p>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            ₹{status.totalAmount}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Revenue generated from purchased courses
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">
          <p className="text-sm text-slate-500">Total Sales</p>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {status.totalPurchasedCourse}
          </h2>

          <p className="text-sm text-slate-400 mt-2">
            Total course enrollments by students
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">
            Course Purchases
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Overview of how students are purchasing your courses.
          </p>
        </div>

        <div className="rounded-[2rem] bg-slate-50 border border-slate-200 p-4">
          <Chart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
