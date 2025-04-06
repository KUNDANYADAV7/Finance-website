import React, { useContext, useState } from "react";
import "../styles/ForgotPassword.css";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { isAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/api/v1/user/password/forgot`,
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      setEmail(""); // ✅ clear input after success
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <h2>Forgot Password</h2>
          <p>Enter your email address to receive a password reset token.</p>
          <form
            onSubmit={handleForgotPassword}
            className="forgot-password-form"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="forgot-input"
            />
            <button
  type="submit"
  disabled={loading}
  className={`forgot-btn ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {loading ? "Sending..." : "Send Reset Link"}
</button>

          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
