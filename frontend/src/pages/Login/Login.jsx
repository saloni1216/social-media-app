import "./Login.css";
import { Link } from "react-router-dom";

import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";

function Login() {
  return (
    
    <div className="login-page">
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
        A modern social platform.
    </span>

    <div className="features">

        <div className="feature">
            🚀 Fast & Secure Authentication
        </div>

        <div className="feature">
            💬 Real-time Chat & Messaging
        </div>

        <div className="feature">
            ❤️ Share Posts & Connect
        </div>

    </div>

</div>
      </div>

      <div className="right-side">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <p>Sign in to access your account.</p>

          <form>
            <div className="input-box">
              <label>Email</label>

              <div className="input-field">
                <FaEnvelope />

                <input type="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className="input-box">
              <label>Password</label>

              <div className="input-field">
                <FaLock />

                <input type="password" placeholder="Enter your password" />

                <FaEye className="eye" />
              </div>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#">Forgot Password?</a>
            </div>

            <button className="login-btn">Sign In</button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="google-btn">
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="bottom-text">
            Don't have an account?
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
