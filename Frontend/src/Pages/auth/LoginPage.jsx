import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utls/axios";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const resetState = () => {
    setEmail("");
    setPassword("");
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response?.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data?.token);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Logged in Successfully");
      resetState();
      queryClient.invalidateQueries({ q: ["authUser"] });
    },
    onError: (err) => {
      toast.error("Please check user credentials");
      console.log(err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataObj = { email, password };
    login(dataObj);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-14 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Click here to create a{" "}
          <Link
            to="/signup"
            className="text-black underline font-semibold hover:underline"
          >
            New Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
