import React, { Fragment, useEffect, useState } from "react";
import LoginPage from "./Pages/auth/LoginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./Pages/auth/SignupPage";
import Sidebar from "./Components/Sidebar";
import HomePage from "./Pages/teacher/HomePage";
import { USER } from "./data/user";
import "./App.css";
import AddCourse from "./Pages/teacher/AddCourse";
import AddChapter from "./Pages/teacher/AddChapter";
import BrowseCourse from "./Pages/student/BrowseCourse";
import Dashboard from "./Pages/student/Dashboard";
import CourseDetails from "./Pages/student/CourseDetails";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "./Components/LoadingScreen";
import AuthProtectRoute from "./Components/ProtectRoutes/AuthProtectRoute";
import UserProtectRoute from "./Components/ProtectRoutes/UserProtectRoute";
import PublicRoute from "./Components/ProtectRoutes/PublicRoute";
import TeacherCourseDetails from "./Pages/teacher/TeacherCourseDetails";
import UserProfile from "./Pages/UserProfile";
import AppLayout from "./Components/AppLayout";
import { lazy, Suspense } from "react";
const Analytics = lazy(() => import("./Pages/teacher/Analytics"));

/**
 *
 * check if all the routes are working
 * / path sends no page
 * add path for * as well
 */
const App = () => {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => {
      const localData = localStorage.getItem("user");
      return localData ? JSON.parse(localData) : null;
    },
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoadingScreen) return <LoadingScreen />;
  console.log(user);

  // console.log(user?.token);
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/browse" : "/login"} replace />}
        />
        {/* PUBLIC ROUTES  */}
        <Route element={<PublicRoute user={user} />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* PROTECTED ROUTES  */}
        <Route element={<AuthProtectRoute loading={isLoading} user={user} />}>
          {/* LAYOUT WRAPPER  */}
          <Route element={<AppLayout user={user} />}>
            {/* COMMON FOR BOTH STUDENT AND TEACHER  */}
            <Route path="me" element={<UserProfile />} />
            {/* TEACHER ROUTES  */}
            <Route
              element={
                <UserProtectRoute
                  loading={isLoading}
                  user={user}
                  allowedRoutes="teacher"
                />
              }
            >
              <Route path="courses" element={<HomePage />} />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<LoadingScreen />}>
                    <Analytics />
                  </Suspense>
                }
              />
              <Route
                path="teacher/courses/:courseId"
                element={<TeacherCourseDetails />}
              />
              <Route path="new-course" element={<AddCourse />} />
              <Route path="add-chapter" element={<AddChapter />} />
            </Route>
            {/* STUDENT ROUTES  */}
            <Route
              element={
                <UserProtectRoute
                  loading={isLoading}
                  allowedRoutes="student"
                  user={user}
                />
              }
            >
              {/* <Route path="me" element={<UserProfile />} /> */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/browse" element={<BrowseCourse />} />
            </Route>

            <Route path="courses/:courseId" element={<CourseDetails />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
