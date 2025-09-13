"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import registerLottie from "../../../../../public/register.json";
import { Button, TextField } from "@mui/material";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageData = new FormData();
    imageData.append("file", selectedFile);
    imageData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
    );

    try {
      const imageRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        imageData
      );

      const imageUrl = imageRes.data.secure_url;

      await register(name, email, password, imageUrl);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex my-6 flex-col max-w-[1500px] mx-auto px-4 sm:flex-row gap-6 justify-start items-center md:justify-center">
      <Lottie
        className="flex-1"
        animationData={registerLottie}
        loop={true}
      ></Lottie>

      <div className="w-full flex-1 shadow-xl rounded-md">
        <div className="px-4 py-12">
          <h1 className="text-3xl font-extrabold">Create Your Account</h1>
          <p className="mb-8 mt-2 text-sm font-semibold">Join Roomora today</p>

          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="profileImage" className="cursor-pointer">
                <Image
                  src={preview || `/image-upload-icon.png`}
                  alt="Upload"
                  height={52}
                  width={52}
                  className="w-13 h-13 object-cover rounded-full border-2 p-0.5 border-[#F7602C]"
                />
              </label>
              <input
                type="file"
                id="profileImage"
                required
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="mb-6">
              <TextField
                label="Full Name"
                variant="outlined"
                className="w-full"
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                "Register"
              )}
            </Button>
            <p className="text-sm my-2 text-center">
              Already have an account ?{" "}
              <Link
                href="/login"
                className="hover:underline text-[#F7602C] font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;