import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        toast.success("Logged in successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md px-8 py-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                         transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                         transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Submit */}
          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white font-semibold py-2.5 rounded-md
                       hover:bg-orange-500 transition-colors duration-200 mt-1
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
