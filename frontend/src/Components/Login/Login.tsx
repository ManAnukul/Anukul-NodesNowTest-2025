import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import axiosInstant from "../../lib/axios";
import { useFormik } from "formik";
import * as yup from "yup";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required")
      .test("is-domain-valid", "Invalid email format", (value) => {
        if (!value) return false;
        const domain = value.split("@")[1];
        return !!(domain && domain.includes("."));
      }),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstant.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        formik.resetForm();
        navigate("/");
      }
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message || "Login failed.";
        setError(errorMessage);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          {error && (
            <div
              className="bg-red-100 text-red-700 flex items-center p-4 rounded mb-4"
              role="alert"
              aria-label="error_of_login"
            >
              <Lock size={18} className="mr-2" />
              {error}
            </div>
          )}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Login
              </h2>
              <h2>Email</h2>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-label="login-email"
                name="email"
                value={formik.values.email}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.email && formik.errors.email && (
                <h4
                  style={{ color: "red", paddingLeft: "7px" }}
                  aria-label="error-email"
                >
                  {formik.errors.email}
                </h4>
              )}
            </div>

            <div>
              <h2>Password</h2>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-label="login-password"
                name="password"
                value={formik.values.password}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.touched.password && formik.errors.password && (
                <h4
                  style={{ color: "red", paddingLeft: "7px" }}
                  aria-label="error-password"
                >
                  {formik.errors.password}
                </h4>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="submit-login-loading-spinner"
              className={`w-full py-2 px-4 flex justify-center items-center gap-2 font-semibold rounded-lg shadow-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading && (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              )}
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-sm text-blue-600 hover:underline"
              >
                Don't have an account? Create one
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className=" md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1675289034739-5703b7cc7688?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>
    </div>
  );
}

export default Login;
