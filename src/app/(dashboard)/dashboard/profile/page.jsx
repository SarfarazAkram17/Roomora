"use client";
import { useAuth } from "@/context/AuthContext";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiEdit3, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

const Profile = () => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.photo && !preview) {
      setPreview(user.photo);
    }
  }, [user?.photo, preview]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleEditClick = () => {
    setPreview(user?.photo || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    const trimmedName = name.trim();
    setLoading(true);

    try {
      let imageUrl = user.photo;

      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("file", selectedFile);
        imageData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          imageData
        );

        imageUrl = res.data.secure_url;
      }

      await updateProfile(trimmedName, imageUrl || preview, user.email);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loader />;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-[#F7602C]">
        Welcome back, {user?.name} 👋
      </h2>

      <div className="shadow-lg w-contain max-w-2xl p-5 bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
          <img
            src={user?.photo}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-[#F7602C] shadow"
          />
          <div className="flex-1 space-y-3">
            <p>
              <span className="font-semibold">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className="capitalize">{user?.role}</span>
            </p>
            <button
              onClick={handleEditClick}
              className="bg-transparent flex gap-2 items-center cursor-pointer border-2 border-[#F7602C] hover:bg-[#F7602C] text-[#F7602C] hover:text-white/90 font-bold px-4 py-2 rounded-sm"
            >
              <FiEdit3 />
              Edit Profile
            </button>
          </div>
        </div>

        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 z-40 backdrop-blur-md"
              onClick={() => !loading && setIsModalOpen(false)}
            ></div>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white border rounded-lg max-w-md w-full p-8 relative shadow-xl">
                <button
                  onClick={() => !loading && setIsModalOpen(false)}
                  className="absolute top-4 right-4 hover:text-red-500 cursor-pointer text-gray-500 transition"
                  aria-label="Close modal"
                  disabled={loading}
                >
                  <FiX size={26} />
                </button>

                <h3 className="text-2xl font-semibold mb-6 text-center">
                  Edit Profile
                </h3>

                <div className="flex flex-col items-start mb-4">
                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer block w-32 h-32 rounded-full border-2 border-[#F7602C] overflow-hidden mb-2"
                  >
                    <Image
                      src={preview}
                      alt="Profile Preview"
                      height={128}
                      width={128}
                      className="w-full h-full object-cover"
                    />
                  </label>

                  <button
                    onClick={() =>
                      document.getElementById("profileImage").click()
                    }
                    className="bg-transparent px-4 py-2 font-semibold rounded-md cursor-pointer text-[#F7602C] mb-4 border-2 border-[#F7602C] hover:bg-[#F7602C] hover:text-white/90"
                  >
                    Change Profile Photo
                  </button>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <TextField
                  label="Name"
                  variant="outlined"
                  className="w-full"
                  required
                  type="text"
                  defaultValue={user?.name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-8">
                  <button
                    onClick={() => !loading && setIsModalOpen(false)}
                    className="bg-transparent cursor-pointer text-black px-3 py-1 rounded-sm border border-black hover:bg-gray-100"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={handleUpdate}
                    disabled={loading || !preview}
                    variant="contained"
                  >
                    {loading ? (
                      <LoaderCircle className="animate-spin text-[#F7602C]" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;