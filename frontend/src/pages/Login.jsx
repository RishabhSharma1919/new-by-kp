// import React, { useContext, useState, useEffect } from "react";
// import { ShopContext } from "../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// const Login = () => {
//   const { token, setToken, navigate,backendUrl } = useContext(ShopContext);

//   const [currentStep, setCurrentStep] = useState("email-verification");
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [verifyCode, setVerifyCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resetCode, setResetCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");


//   useEffect(() => {
//     if (token) navigate("/");
//   }, [token, navigate]);

//   const handleRequest = async (url, data, successCallback, errorMessage) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(url, data);
//       if (res.data.success) {
//         successCallback(res.data);
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || errorMessage);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-transparent">
//       <Card className="w-[90%] sm:max-w-md p-8 bg-[#D6D6C7] text-[#2D2A26] shadow-xl rounded-lg">
//         <h2 className="text-2xl font-semibold capitalize text-center mb-6">{currentStep.replace("-", " ")}</h2>

//         <Input
//           type="email"
//           placeholder="Enter your email"
//           className="bg-[#B0B0A3] text-[#222] border border-gray-500 rounded-md p-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           disabled={loading}
//         />

//         {currentStep === "email-verification" && (
//           <Button
//             onClick={() => handleRequest(`${backendUrl}/api/user/verifyemail`, { email }, () => {
//               toast.success("Verification code sent!");
//               setCurrentStep("sign-up");
//             }, "Failed to send verification code.")}
//             className="mt-4 w-full bg-[#44403C] hover:bg-[#2D2A26] text-white py-2 rounded-md"
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Verification Code"}
//           </Button>
//         )}

//         {currentStep === "sign-up" && (
//           <>
//             <Input
//               type="text"
//               placeholder="Full Name"
//               className="bg-[#B0B0A3] text-[#222] border border-gray-500 rounded-md p-3"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               disabled={loading}
//             />
//             <Input
//               type="password"
//               placeholder="Create Password"
//               className="bg-[#B0B0A3] text-[#222] border border-gray-500 rounded-md p-3"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//             />
//             <Input
//               type="text"
//               placeholder="Enter Verification Code"
//               className="bg-[#B0B0A3] text-[#222] border border-gray-500 rounded-md p-3"
//               value={verifyCode}
//               onChange={(e) => setVerifyCode(e.target.value)}
//               disabled={loading}
//             />
//             <Button
//               onClick={() => handleRequest(`${backendUrl}/api/user/registerUser`, { name, email, password, verifyCode }, () => {
//                 toast.success("Account created successfully!");
//                 setCurrentStep("login");
//               }, "Failed to sign up.")}
//               className="mt-4 w-full bg-[#44403C] hover:bg-[#2D2A26] text-white py-2 rounded-md"
//               disabled={loading}
//             >
//               {loading ? "Signing Up..." : "Sign Up"}
//             </Button>
//           </>
//         )}

//         {currentStep === "login" && (
//           <>
//             <Input
//               type="password"
//               placeholder="Enter your password"
//               className="bg-[#B0B0A3] text-[#222] border border-gray-500 rounded-md p-3"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//             />
//             <Button
//               onClick={() => handleRequest(`${backendUrl}/api/user/login`, { email, password }, (data) => {
//                 setToken(data.token);
//                 localStorage.setItem("token", data.token);
//                 toast.success("Login successful!");
//                 navigate("/");
//               }, "Failed to login.")}
//               className="mt-4 w-full bg-[#44403C] hover:bg-[#2D2A26] text-white py-2 rounded-md"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </Button>
//             <p onClick={() => setCurrentStep("forgot-password")} className="text-[#2D2A26] text-sm mt-2 cursor-pointer">
//               Forgot Password?
//             </p>
//           </>
//         )}

//         <div className="w-full flex justify-between text-sm mt-6 text-[#2D2A26]">
//           {currentStep === "login" ? (
//             <p onClick={() => setCurrentStep("email-verification")} className="cursor-pointer">
//               Need an account? <span className="text-[#44403C]">Sign Up</span>
//             </p>
//           ) : (
//             <p onClick={() => setCurrentStep("login")} className="cursor-pointer">
//               Already have an account? <span className="text-[#44403C]">Login Here</span>
//             </p>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Login;







import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Login = () => {
  const { token, setToken, navigate,backendUrl } = useContext(ShopContext);

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
      const res = await axios.post(`${backendUrl}/api/user/verifyemail`, { email });
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
      const res = await axios.post(`${backendUrl}/api/user/registerUser`, {
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
      const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
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
      const res = await axios.post(`${backendUrl}/api/user/forgotpassword`, { email });
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
      const res = await axios.post(`${backendUrl}/api/user/resetpassword`, {
        email,
        resetCode,
        newPassword,
      });

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
    <div className="flex flex-col items-center w-[90%] sm:max-w-md m-auto mt-14 text-gray-800">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl capitalize">
            {currentStep.replace("-", " ")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Email Input */}
          <Input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
          />

          {/* Email Verification Step */}
          {currentStep === "email-verification" && (
            <Button onClick={handleEmailVerification} disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          )}

          {/* Sign Up Step */}
          {currentStep === "sign-up" && (
            <>
              <Input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={loading}
              />
              <Input
                type="password"
                placeholder="Create Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading}
              />
              <Input
                type="text"
                placeholder="Enter Verification Code"
                required
                onChange={(e) => setVerifyCode(e.target.value)}
                value={verifyCode}
                disabled={loading}
              />
              <Button onClick={handleSignUp} disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </>
          )}

          {/* Login Step */}
          {currentStep === "login" && (
            <>
              <Input
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading}
              />
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              <p
                onClick={() => setCurrentStep("forgot-password")}
                className="cursor-pointer text-sm text-blue-500"
              >
                Forgot Password?
              </p>
            </>
          )}

          {/* Forgot Password Step */}
          {currentStep === "forgot-password" && (
            <Button onClick={handleForgotPassword} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          )}

          {/* Reset Password Step */}
          {currentStep === "reset-password" && (
            <>
              <Input
                type="text"
                placeholder="Enter Reset Code"
                required
                onChange={(e) => setResetCode(e.target.value)}
                value={resetCode}
                disabled={loading}
              />
              <Input
                type="password"
                placeholder="Enter New Password"
                required
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                disabled={loading}
              />
              <Button onClick={handleResetPassword} disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}

          {/* Navigation Links */}
          <div className="flex justify-between text-sm">
            {currentStep === "login" ? (
              <>
                <p onClick={() => setCurrentStep("email-verification")} className="cursor-pointer">
                  Need an account? <span className="text-blue-500">Sign Up</span>
                </p>
                <p onClick={() => setCurrentStep("forgot-password")} className="cursor-pointer">
                  Forgot Password?
                </p>
              </>
            ) : (
              <p onClick={() => setCurrentStep("login")} className="cursor-pointer">
                Already have an account? <span className="text-blue-500">Login Here</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
