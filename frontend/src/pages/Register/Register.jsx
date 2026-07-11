import "./Register.css";
import { Link } from "react-router-dom";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
} from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";

function Register() {
    return (
        <div className="register-page">

            <div className="left-side">

                <div className="brand">

                    <div className="logo-circle">
                        S
                    </div>

                    <h1>Socialize</h1>

                    <p>
                        Connect. Share. Inspire.
                    </p>

                    <span>
                        Create your account and join the community.
                    </span>

                    <div className="features">

                        <div className="feature">
                            🚀 Fast & Secure Authentication
                        </div>

                        <div className="feature">
                            💬 Chat with Friends
                        </div>

                        <div className="feature">
                            ❤️ Share Posts & Moments
                        </div>

                    </div>

                </div>

            </div>

            <div className="right-side">

                <div className="register-card">

                    <h2>Create Account</h2>

                    <p>
                        Sign up to start your journey.
                    </p>

                    <form>

                        <div className="input-box">

                            <label>Full Name</label>

                            <div className="input-field">

                                <FaUser />

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                />

                            </div>

                        </div>

                        <div className="input-box">

                            <label>Email</label>

                            <div className="input-field">

                                <FaEnvelope />

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                />

                            </div>

                        </div>

                        <div className="input-box">

                            <label>Password</label>

                            <div className="input-field">

                                <FaLock />

                                <input
                                    type="password"
                                    placeholder="Create password"
                                />

                                <FaEye className="eye" />

                            </div>

                        </div>

                        <div className="input-box">

                            <label>Confirm Password</label>

                            <div className="input-field">

                                <FaLock />

                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                />

                                <FaEye className="eye" />

                            </div>

                        </div>

                        <button className="register-btn">

                            Create Account

                        </button>

                    </form>

                    <div className="divider">

                        <span>OR</span>

                    </div>

                    <button className="google-btn">

                        <FcGoogle size={22} />

                        Continue with Google

                    </button>

                    <div className="bottom-text">

                        Already have an account?

                        <Link to="/login">

                            Sign In

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;