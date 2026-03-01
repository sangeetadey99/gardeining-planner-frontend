import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(formData);

      // 
      const token = res.data.token;
      const user = res.data.user;

      login(token, user);

      // optional but recommended
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 transition-transform duration-300 hover:scale-[1.02]">
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="text-4xl sm:text-5xl mb-3">🌿</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Login to manage your garden
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg active:scale-95 transition-all duration-200 text-base"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-600 font-medium hover:text-green-700 hover:underline transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Additional Features */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-3">Or continue with</p>
            <div className="flex justify-center space-x-3">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="text-sm">📧</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <span className="text-sm">🔐</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;