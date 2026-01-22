import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "./authSlice";
import type { AppDispatch, RootState } from "../../store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { AuthData } from "../../types";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthData>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: AuthData) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              className={`w-full px-3 py-2 border rounded ${errors.username ? "border-red-500" : "border-gray-300"}`}
              type="text"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">
                {errors.username.message as string}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-3 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
              type="password"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
