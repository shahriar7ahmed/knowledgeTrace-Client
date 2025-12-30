import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { createUser, setLoading } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // create user with name
            const result = await createUser(email, password, name);
            if (result.success) {
                showToast("Registration successful! Welcome to KnowledgeTrace.", "success");
                // Navigate to dashboard or login
                navigate('/dashboard');
            } else {
                showToast(result.error || "Registration failed. Please try again.", "error");
            }
        } catch (error) {
            showToast(error.message || "An error occurred during registration.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-24">
            <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
                    Create an Account
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Join KnowledgeTrace & explore academic resources
                </p>

                {/* FORM */}
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="input input-bordered w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="input input-bordered w-full pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-11 cursor-pointer text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="btn btn-success w-full text-white">
                        Register
                    </button>

                    {/* Divider */}
                    <div className="divider">OR</div>

                    {/* Google Login */}
                    <button type="button" className="btn w-full bg-white border border-gray-300 hover:bg-gray-200 text-gray-700">
                        Continue with Google
                    </button>
                </form>

                {/* Already Have Account */}
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-700 font-semibold hover:underline">
                        Login Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
