import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // Default to student
    const { createUser, setLoading } = useContext(AuthContext);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Email domain validation
    const validateEmail = (email, role) => {
        const studentDomain = "@ugrad.iiuc.ac.bd";
        const supervisorDomain = "@iiuc.ac.bd";

        if (role === "student") {
            if (!email.endsWith(studentDomain)) {
                return `Students must use ${studentDomain} email`;
            }
        } else if (role === "supervisor") {
            if (!email.endsWith(supervisorDomain)) {
                return `Supervisors must use ${supervisorDomain} email`;
            }
            // Make sure it's not a student email
            if (email.endsWith("@ugrad.iiuc.ac.bd")) {
                return `Please use faculty email ${supervisorDomain}, not student email`;
            }
        }
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate email domain
            const emailError = validateEmail(email, role);
            if (emailError) {
                showToast(emailError, "error");
                setLoading(false);
                return;
            }

            // create user with name and role
            const result = await createUser(email, password, name, role);
            if (result.success) {
                showToast(`Registration successful! Welcome to KnowledgeTrace as ${role}.`, "success");
                // Navigate to dashboard
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 px-4 pt-24">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                    Create an Account
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Join KnowledgeTrace & explore academic resources
                </p>

                {/* FORM */}
                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Role Selection */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">I am a:</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                className={`p-4 rounded-xl border-2 transition-all ${role === "student"
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                                    }`}
                            >
                                <FaUserGraduate className="text-2xl mx-auto mb-2" />
                                <span className="font-medium">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("supervisor")}
                                className={`p-4 rounded-xl border-2 transition-all ${role === "supervisor"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                                    }`}
                            >
                                <FaChalkboardTeacher className="text-2xl mx-auto mb-2" />
                                <span className="font-medium">Supervisor</span>
                            </button>
                        </div>
                    </div>

                    {/* Email Domain Info */}
                    <div className={`p-3 rounded-lg text-sm ${role === "student" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"
                        }`}>
                        <p className="font-medium">
                            {role === "student"
                                ? "📧 Use your @ugrad.iiuc.ac.bd email"
                                : "📧 Use your @iiuc.ac.bd faculty email"
                            }
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            {role === "student" ? "Student Email" : "Faculty Email"}
                        </label>
                        <input
                            type="email"
                            placeholder={
                                role === "student"
                                    ? "yourname@ugrad.iiuc.ac.bd"
                                    : "yourname@iiuc.ac.bd"
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password (min 6 characters)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                            minLength={6}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-11 cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </span>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${role === "student"
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            }`}
                    >
                        Register as {role === "student" ? "Student" : "Supervisor"}
                    </button>
                </form>

                {/* Already Have Account */}
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                        Login Now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
