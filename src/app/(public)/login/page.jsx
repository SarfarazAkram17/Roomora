"use client";
import { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loginLottie from "../../../../public/login.json";
import { Button, TextField } from "@mui/material";
import { LoaderCircle } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true);

    console.log(email, password);
    //  axiosInstance.post("/users", {
    //   email,
    //   name: res.user.displayName,
    //   role: "customer",
    //   photo: res.user.photoURL,
    //   createdAt: res.user.metadata.createdAt,
    //   last_log_in: Date.now().toString(),
    // });
  };

  return (
    <div className="flex flex-col my-6 max-w-[1500px] mx-auto px-4 sm:flex-row gap-6 justify-start items-center md:justify-center">
      <Lottie className="flex-1 h-96" animationData={loginLottie} loop={true}></Lottie>

      <div className="w-full flex-1 shadow-xl rounded-md">
        <div className="px-4 py-12">
          <h1 className="text-3xl font-extrabold">Welcome Back</h1>
          <p className="mb-8 mt-2 text-sm font-semibold">Login with Roomora</p>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <TextField
                label="Email"
                variant="outlined"
                className="w-full"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-6">
              <TextField
                label="Password"
                variant="outlined"
                className="w-full"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-5 right-3 cursor-pointer z-10"
                  size={17}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-5 right-3 cursor-pointer z-10"
                  size={17}
                />
              )}
            </div>

            <Button
              variant="contained"
              disabled={loading}
              type="submit"
              className="text-white w-full"
            >
              {loading ? (
                <LoaderCircle className="animate-spin text-[#F7602C]" />
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-sm my-2 text-center">
              Don't have any account ?{" "}
              <Link
                href="/register"
                className="hover:underline text-[#F7602C] font-semibold"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
