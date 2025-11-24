import React, { use } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
   
    const {loginUser ,setLoading} = use(AuthContext);
    const handleLogin = (e) => {
        e.preventDefault();
        // Login logic here
        const form = e.target;
        const email = form[0].value;
        const password = form[1].value;
        console.log("Logging in:", { email, password });
        //login user
        loginUser(email, password)
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
       
            <div className="hero bg-base-200 min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Login now!</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            <form onSubmit={handleLogin} className="fieldset">
                                <label className="label">Email</label>
                                <input type="email" className="input" placeholder="Email" />
                                <label className="label">Password</label>
                                <input type="password" className="input" placeholder="Password" />
                                <div><a className="link link-hover">Not registered yet?<Link to="/register"> Register Now</Link></a></div>
                                <button className="btn btn-neutral mt-4">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
       
    );
};

export default Login;