import axios from "axios";
import React, { useState } from "react";

function AuthPage({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));


        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const endpoint = isLogin ? "/login" : "/register";
            const payload = isLogin
                ? {
                      email: formData.email,
                      password: formData.password,
                  }
                : formData;

            const response = await axios.post(endpoint, payload);


            onLogin(response.data.data.user, response.data.data.token);
        } catch (error) {
            console.error("Auth error:", error);

            if (error.response?.status === 422) {

                setErrors(error.response.data.errors || {});
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
    };

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <span className="text-3xl font-bold text-white">
                            TaskMinder
                        </span>
                    </div>

                    <div className="text-white space-y-6">
                        <h1 className="text-5xl font-bold leading-tight">
                            Organize Your
                            <br />
                            Tasks Efficiently
                        </h1>
                        <p className="text-xl text-indigo-100">
                            Manage your projects, track progress, and
                            collaborate with your team all in one place.
                        </p>
                    </div>
                </div>

                <div className="text-white/80 text-sm">
                    © 2024 TaskMinder. All rights reserved.
                </div>
            </div>


            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">

                    <div className="lg:hidden flex items-center justify-center mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-gray-800 ml-3">
                            TaskMinder
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {isLogin ? "Welcome Back!" : "Create Account"}
                            </h2>
                            <p className="text-gray-600">
                                {isLogin
                                    ? "Sign in to continue to TaskMinder"
                                    : "Sign up to get started with TaskMinder"}
                            </p>
                        </div>


                        {errors.general && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                                <svg
                                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{errors.general}</span>
                            </div>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-5">

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                        placeholder="Enter your full name"
                                        required={!isLogin}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name[0]}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                    placeholder="Enter your email"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                                    placeholder="Enter your password"
                                    required
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password[0]}
                                    </p>
                                )}
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="Confirm your password"
                                        required={!isLogin}
                                    />
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : isLogin ? (
                                    "Sign In"
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>


                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isLogin
                                    ? "Don't have an account? "
                                    : "Already have an account? "}
                                <button
                                    type="button"
                                    onClick={switchMode}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    {isLogin ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
