import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utls/axios";
import { data } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingScreen from "../Components/LoadingScreen";

const UserProfile = () => {
  const [editNameMode, setEditNameMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    },
  });
  if (isLoading) return <LoadingScreen />;
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        password: "",
      });
    }
  }, [user]);
  const { mutate: updateProfile } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.put("/user/me", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("update succesfull");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      const user = data?.user;
      if (user) localStorage.setItem("user", JSON.stringify(user));
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => toast.error(err.message || "Failed to update"),
  });
  console.log(user, "User from profile page");
  return (
    <div className="max-w-5xl mx-auto p-5">
      {/* PROFILE HEADER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
        <h2 className="text-3xl font-bold text-slate-900">{user?.name}</h2>

        <p className="text-sm text-slate-500 mt-1">{user?.email}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="px-3 py-1 text-xs rounded-full bg-slate-100">
            Role: {user?.role}
          </span>

          <span className="px-3 py-1 text-xs rounded-full bg-slate-100">
            ID: {user?._id}
          </span>
        </div>
      </div>

      {/* NAME SECTION */}
      <div className="bg-white border rounded-2xl p-5 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Name</h3>

          <button
            onClick={() => setEditNameMode(true)}
            className="px-3 py-1 text-sm bg-slate-900 text-white rounded-lg"
          >
            Edit
          </button>
        </div>

        {!editNameMode ? (
          <p className="mt-2 text-slate-700">{user?.name}</p>
        ) : (
          <div className="mt-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setEditNameMode(false);
                  updateProfile(formData);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => setEditNameMode(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PASSWORD SECTION */}
      <div className="bg-white border rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Password</h3>

          <button
            onClick={() => setEditPasswordMode(true)}
            className="px-3 py-1 text-sm bg-slate-900 text-white rounded-lg"
          >
            Change
          </button>
        </div>

        {!editPasswordMode ? (
          <p className="mt-2 text-slate-500">••••••••</p>
        ) : (
          <div className="mt-3">
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="New Password"
              className="w-full p-2 border rounded-lg"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setEditPasswordMode(false);
                  updateProfile(formData);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Update
              </button>

              <button
                onClick={() => setEditPasswordMode(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {user?.role === "student" ? (
          <>
            <div className="bg-slate-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">Purchased Courses</p>
              <h3 className="text-3xl font-bold">
                {user?.purchasedCourses.length}
              </h3>
            </div>

            <div className="bg-slate-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">Learning Status</p>
              <h3 className="text-3xl font-bold">Active</h3>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">Created Courses</p>
              <h3 className="text-3xl font-bold">
                {user?.createdCourses.length}
              </h3>
            </div>

            <div className="bg-slate-50 border rounded-2xl p-5">
              <p className="text-sm text-slate-500">Teaching Status</p>
              <h3 className="text-3xl font-bold">Active</h3>
            </div>
          </>
        )}
      </div>

      {/* COURSE LIST */}
      <div className="bg-white border rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4">
          {user?.role === "student" ? "Purchased Courses" : "Created Courses"}
        </h3>

        {user?.role === "student" ? (
          user?.purchasedCourses.length > 0 ? (
            <ul className="space-y-2">
              {user?.purchasedCourses.map((course, i) => (
                <li
                  key={i}
                  className="p-3 bg-slate-50 border rounded-lg text-sm"
                >
                  {course?.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No courses purchased yet</p>
          )
        ) : user?.createdCourses.length > 0 ? (
          <ul className="space-y-2">
            {user?.createdCourses.map((course, i) => (
              <li key={i} className="p-3 bg-slate-50 border rounded-lg text-sm">
                {course?.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No courses created yet</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
