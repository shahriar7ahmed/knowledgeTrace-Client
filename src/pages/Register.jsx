import React, { use,  useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {createUser ,setLoading} = use(AuthContext);

    const handleRegister = (e) => {

        
        e.preventDefault();
        // Registration logic here
        const form = e.target;
        const name = form[0].value;
        const email = form[1].value;
        const password = form[2].value;
        console.log("Registering:", { name, email, password });
        // create user 
        createUser(email, password)
        .then(result =>{
            const loggedUser = result.user;
            console.log(loggedUser);
        })
        .catch(error =>{
            console.log(error.message);
        })
        .finally(() => setLoading(false));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
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
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            className="input input-bordered w-full pr-10"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-11 cursor-pointer text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Register Button */}
                    <button className="btn btn-success w-full text-white">
                        Register
                    </button>

                    {/* Divider */}
                    <div className="divider">OR</div>

                    {/* Google Login */}
                    <button className="btn w-full bg-white border border-gray-300 hover:bg-gray-200 text-gray-700">
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
