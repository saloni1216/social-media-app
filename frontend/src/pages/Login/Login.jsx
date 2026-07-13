import "./Login.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser(formData);

      console.log(response.data);

      localStorage.setItem("access_token", response.data.access);

      localStorage.setItem("refresh_token", response.data.refresh);

      navigate("/home");
    } catch (error) {
      console.error(error);

      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="left-side">
        <div className="brand">
          <div className="logo-circle">S</div>

          <h1>Socialize</h1>

          <p>Connect. Share. Inspire.</p>

          <span>A modern social platform.</span>

          <div className="features">
            <div className="feature">🚀 Fast & Secure Authentication</div>
            <div className="feature">💬 Real-time Chat & Messaging</div>
            <div className="feature">❤️ Share Posts & Connect</div>
          </div>
        </div>
      </div>

      <div className="right-side">
        <div className="login-card">
          <h2>Welcome Back</h2>

          <p>Sign in to access your account.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email</label>

              <div className="input-field">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

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

              {error && <p className="error">{error}</p>}

            <button className="login-btn">
              {loading ? "Signing In..." : "Sign In"}
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
            Don't have an account?
            <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
