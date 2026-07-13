import "./Register.css";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
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

      await registerUser(formData);

      alert("Registration Successful 🎉");

      navigate("/login");
    } catch (error) {
      console.error(error);

      setError("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="left-side">
        <div className="brand">
          <div className="logo-circle">S</div>

          <h1>Socialize</h1>

          <p>Connect. Share. Inspire.</p>

          <span>Create your account and join the community.</span>

          <div className="features">
            <div className="feature">🚀 Fast & Secure Authentication</div>
            <div className="feature">💬 Chat with Friends</div>
            <div className="feature">❤️ Share Posts & Moments</div>
          </div>
        </div>
      </div>

      <div className="right-side">
        <div className="register-card">
          <h2>Create Account</h2>

          <p>Sign up to start your journey.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Full Name</label>

              <div className="input-field">
                <FaUser />

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="input-box">
              <label>Email</label>

              <div className="input-field">
                <FaEnvelope />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />

                <FaEye className="eye" />
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <button className="register-btn">
              {loading ? "Creating Account..." : "Create Account"}
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
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
