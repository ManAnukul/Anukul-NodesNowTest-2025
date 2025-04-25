import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstant from "../../lib/axios";
import { Loader2, Lock } from "lucide-react";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as yup from "yup";

function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .test(
        "has-lowercase",
        "Password must include at least one lowercase letter",
        (value) => /[a-z]/.test(value || "")
      )
      .test(
        "has-uppercase",
        "Password must include at least one uppercase letter",
        (value) => /[A-Z]/.test(value || "")
      )
      .test(
        "has-number",
        "Password must include at least one number",
        (value) => /[0-9]/.test(value || "")
      )
      .test(
        "has-symbol",
        "Password must include at least one special character",
        (value) => /[!@#$%^&*()_\-+={}[\]:;"'|,.<>/?\\]/.test(value || "")
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleRegister(values);
    },
  });

  const handleRegister = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstant.post("/users", {
        email: email.trim(),
        password: password.trim(),
      });
      if (response.status === 201) {
        formik.resetForm();
        navigate("/login  ");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error);
        setError(error.response?.data.message || "Registration failed.");
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
              className="bg-red-100 text-red-700 text-center flex items-center justify-center p-4 rounded mb-4"
              role="alert"
            >
              <Lock size={18} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Register
            </h2>

            {/* Email */}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

            {/* Password */}
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              className={`w-full py-2 px-4 flex justify-center items-center gap-2 font-semibold rounded-lg shadow-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading && (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              )}
              {loading ? "Registering in..." : "Register"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1974&q=80')",
        }}
      ></div>
    </div>
  );
}

export default Register;
