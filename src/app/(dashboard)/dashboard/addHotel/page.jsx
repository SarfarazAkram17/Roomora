"use client";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { useAuth } from "@/context/AuthContext";
import { LoaderCircle } from "lucide-react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const amenitiesOptions = [
  { value: "wifi", label: "WiFi" },
  { value: "ac", label: "Air Conditioning" },
  { value: "pool", label: "Swimming Pool" },
  { value: "restaurant", label: "Restaurant" },
  { value: "parking", label: "Parking" },
  { value: "gym", label: "Gym" },
];

const AddHotel = () => {
  const { user, loading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]);
  const router = useRouter();
  const fileInputRef = useRef();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/forbidden");
    }
  }, [user, loading, router]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: addHotel, isPending } = useMutation({
    mutationFn: async (hotelData) => {
      const res = await axios.post(
        `${window.location.origin}/api/hotels`,
        hotelData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Hotel added successfully!");
      reset()
      reset({
        amenities: [],
      });
      setImageURLs([]);
    },
    onError: (error) => {
      if (error.status === 403) {
        router.push("/forbidden");
      }
      toast.error(
        error.response?.data?.message || error.message || "Failed to add hotel"
      );
    },
  });

  // Handle image upload to Cloudinary
  const handleImageUpload = async (files) => {
    if (!files.length) return;

    const totalImages = imageURLs.length + files.length;
    if (totalImages > 4) {
      toast.error("You can upload maximum 4 images.");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const imageData = new FormData();
        imageData.append("file", files[i]);
        imageData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
        );

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          imageData
        );

        uploaded.push(res.data.secure_url);
      }

      setImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = (index) => {
    setImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddHotel = (data) => {
    if (imageURLs.length < 1) {
      return toast.info("Add at least 1 image");
    }

    const hotelData = {
      name: data.name,
      location: data.location,
      totalRooms: parseInt(data.totalRooms),
      pricePerNight: parseFloat(data.pricePerNight),
      amenities: data.amenities.map((a) => a.value),
      images: imageURLs,
      description: data.description,
      addedAt: new Date().toISOString(),
    };

    addHotel(hotelData);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-[#F7602C] text-center">
        Add New Hotel
      </h2>

      <form onSubmit={handleSubmit(handleAddHotel)} className="space-y-5">
        {/* Hotel Name */}
        <div>
          <label className="block font-medium text-sm mb-2">Hotel Name</label>
          <input
            type="text"
            {...register("name", { required: "Hotel name is required" })}
            placeholder="Enter hotel name"
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-sm mb-2">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="w-full border p-2 rounded"
            placeholder="Enter exact Location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Total Rooms */}
        <div>
          <label className="block font-medium text-sm mb-2">Total Rooms</label>
          <input
            type="number"
            {...register("totalRooms", {
              required: "Total rooms is required",
              min: 1,
            })}
            placeholder="Enter total rooms"
            className="w-full border p-2 rounded"
          />
          {errors.totalRooms && (
            <p className="text-red-500 text-sm">{errors.totalRooms.message}</p>
          )}
        </div>

        {/* Price per Night */}
        <div>
          <label className="block font-medium text-sm mb-2">
            Price per Night (BDT)
          </label>
          <input
            type="number"
            {...register("pricePerNight", {
              required: "Price per night is required",
              min: 1,
            })}
            placeholder="Enter Price per Night"
            className="w-full border p-2 rounded"
          />
          {errors.pricePerNight && (
            <p className="text-red-500 text-sm">
              {errors.pricePerNight.message}
            </p>
          )}
        </div>

        {/* Amenities */}
        <div>
          <label className="block font-medium text-sm mb-2">Amenities</label>
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={amenitiesOptions}
                className="w-full"
              />
            )}
          />
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium text-sm mb-2">Hotel Images</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="w-full border p-2 rounded cursor-pointer disabled:bg-gray-300/20 disabled:text-gray-600"
            disabled={uploading || imageURLs.length >= 4}
          />

          {uploading && (
            <p className="text-blue-500 animate-pulse mt-2">Uploading...</p>
          )}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
            {imageURLs.length > 0 &&
              imageURLs.map((url, index) => (
                <div key={index} className="relative w-full h-28">
                  <img
                    src={url}
                    alt="Hotel's image"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-1 cursor-pointer right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-80 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-sm mb-2">Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            className="w-full border p-2 rounded resize-none"
            placeholder="Write a detailed description about the hotel"
            rows="4"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          className="w-full"
          disabled={isPending || uploading}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin text-[#F7602C]" />{" "}
              <span className="animate-pulse ml-1">Adding Hotel...</span>
            </>
          ) : (
            "Add Hotel"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddHotel;