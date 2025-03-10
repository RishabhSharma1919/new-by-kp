import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [currentStep, setCurrentStep] = useState("email-verification");
  // email-verification | sign-up | login | forgot-password | reset-password

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password & Reset Password States
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  // 1️⃣ Handle Email Verification for Signup
  const handleEmailVerification = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/user/verifyemail`, {
        email,
      });
      if (res.data.success) {
        toast.success("Verification code sent! Check your inbox.");
        setCurrentStep("sign-up");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  // 2️⃣ Handle Signup
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/user/registerUser`, {
        name,
        email,
        password,
        verifyCode,
      });
      if (res.data.success) {
        toast.success("Account created successfully!");
        setCurrentStep("login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  // 3️⃣ Handle Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/user/login`, {
        email,
        password,
      });
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  // 4️⃣ Handle Forgot Password - Send Reset Code
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/user/forgotpassword`, {
        email,
      });
      if (res.data.success) {
        toast.success("Reset code sent to your email.");
        setCurrentStep("reset-password");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  // 5️⃣ Handle Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:4000/api/user/resetpassword`, {
        email,
        resetCode,
        newPassword,
      });
      
      //check the reset cde if it is correct 
      if (res.data.success) {
        toast.success("Password reset successful! You can log in now.");
        setCurrentStep("login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl capitalize">
          {currentStep.replace("-", " ")}
        </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Email Input Field */}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter your email"
        required
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={loading}
      />

      {/* Email Verification Step */}
      {currentStep === "email-verification" && (
        <button
          type="button"
          onClick={handleEmailVerification}
          className="bg-black text-white font-light px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </button>
      )}

      {/* Sign Up Step */}
      {currentStep === "sign-up" && (
        <>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Full Name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            disabled={loading}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Create Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
          />
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter Verification Code"
            required
            onChange={(e) => setVerifyCode(e.target.value)}
            value={verifyCode}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSignUp}
            className="bg-black text-white font-light px-8 py-2 mt-4"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </>
      )}

      {/* Login Step */}
      {currentStep === "login" && (
        <>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleLogin}
            className="bg-black text-white font-light px-8 py-2 mt-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p
            onClick={() => setCurrentStep("forgot-password")}
            className="cursor-pointer text-sm"
          >
            Forgot Password?
          </p>
        </>
      )}

      {/* Forgot Password Step */}
      {currentStep === "forgot-password" && (
        <>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="bg-black text-white font-light px-8 py-2 mt-4"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </>
      )}

      {/* Reset Password Step */}
      {currentStep === "reset-password" && (
        <>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter Reset Code"
            required
            onChange={(e) => setResetCode(e.target.value)}
            value={resetCode}
            disabled={loading}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Enter New Password"
            required
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleResetPassword}
            className="bg-black text-white font-light px-8 py-2 mt-4"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {/* Toggle between Sign Up, Login, and Forgot Password */}
<div className="w-full flex justify-between text-sm mt-[-8px]">
  {currentStep === "login" ? (
    <>
      <p onClick={() => setCurrentStep("email-verification")} className="cursor-pointer">
        Need an account? Sign Up
      </p>
      <p onClick={() => setCurrentStep("forgot-password")} className="cursor-pointer text-blue-500">
        Forgot Password?
      </p>
    </>
  ) : currentStep === "forgot-password" ? (
    <p onClick={() => setCurrentStep("login")} className="cursor-pointer">
      Remembered your password? Login Here
    </p>
  ) : (
    <p onClick={() => setCurrentStep("login")} className="cursor-pointer">
      Already have an account? Login Here
    </p>
  )}
</div>

    </div>

  );
};

export default Login;
