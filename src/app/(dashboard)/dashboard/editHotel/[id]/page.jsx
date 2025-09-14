"use client";
import { use, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

const EditHotel = ({ params }) => {
  const { id } = use(params);
  const { user, loading } = useAuth();
  const fileInputRef = useRef();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [existingImages, setExistingImages] = useState([]);
  const [newImageURLs, setNewImageURLs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (user.role !== "admin") router.push("/forbidden");
    }
  }, [user, loading, router]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const amenitiesOptions = [
    { value: "wifi", label: "WiFi" },
    { value: "ac", label: "Air Conditioning" },
    { value: "pool", label: "Swimming Pool" },
    { value: "restaurant", label: "Restaurant" },
    { value: "parking", label: "Parking" },
    { value: "gym", label: "Gym" },
  ];

  // Fetch single hotel
  const { data: hotelData, isLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      const res = await axios.get(`${window.location.origin}/api/hotels/${id}`);
      return res.data.hotel;
    },
    enabled: !!id,
  });

  // Pre-fill form
  useEffect(() => {
    if (hotelData) {
      const selectedAmenities = amenitiesOptions.filter((option) =>
        hotelData.amenities.includes(option.value)
      );

      reset({
        name: hotelData.name,
        location: hotelData.location,
        totalRooms: hotelData.totalRooms,
        pricePerNight: hotelData.pricePerNight,
        description: hotelData.description,
        amenities: selectedAmenities,
      });
      setExistingImages(hotelData.images || []);
    }
  }, [hotelData, reset, register]);

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (files) => {
    if (!files.length) return;
    setUploading(true);

    try {
      const uploaded = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", uploadPreset);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData
        );

        uploaded.push(res.data.secure_url);
      }

      setNewImageURLs((prev) => [...prev, ...uploaded]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleRemoveNewImage = (index) => {
    setNewImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------- UPDATE Hotel MUTATION ----------------
  const { mutate: updateHotel, isPending } = useMutation({
    mutationFn: async (updatedHotel) => {
      const { data } = await axios.patch(
        `${window.location.origin}/api/hotels/${id}`,
        updatedHotel
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire("Success", "🎉 Hotel updated successfully!", "success");
      router.push("/dashboard/manageHotels");
      queryClient.invalidateQueries("hotel");
    },
    onError: (err) => {
      toast.error(`Failed to update Hotel: ${err.message}`);
    },
  });

  const handleHotelUpdate = async (data) => {
    if (existingImages.length + newImageURLs.length < 1) {
      toast.error("Add at least 1 image");
      return;
    }

    const imagesToRemove = hotelData.images.filter(
      (img) => !existingImages.includes(img)
    );

    const updatedHotelData = {
      name: data.name,
      location: data.location,
      totalRooms: parseInt(data.totalRooms),
      pricePerNight: parseFloat(data.pricePerNight),
      amenities: data.amenities.map((a) => a.value),
      description: data.description,
      imagesToAdd: newImageURLs,
      imagesToRemove,
      updatedAt: new Date().toISOString(),
    };

    updateHotel(updatedHotelData);
  };

  if (loading || isLoading) return <Loader />;

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-[#F7602C] mb-6 text-center">
        Edit Product: {hotelData.name}
      </h2>

      <form onSubmit={handleSubmit(handleHotelUpdate)} className="space-y-4">
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
                value={field.value}
                className="w-full"
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* Existing Images */}
        <div>
          <label className="block font-semibold mb-1">
            Existing Images <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {existingImages.length > 0 ? (
              existingImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img
                    src={url}
                    alt={`existing-img-${i}`}
                    className="h-28 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                No existing image yet.
              </p>
            )}
          </div>
        </div>

        {/* add New Image */}
        <div>
          <label className="block font-medium text-sm mb-2">
            Add New Images
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="w-full border p-2 rounded cursor-pointer disabled:bg-gray-300/20 disabled:text-gray-600"
            disabled={
              uploading ||
              existingImages.length === 4 ||
              existingImages.length + newImageURLs.length >= 4
            }
          />

          {uploading && (
            <p className="text-blue-500 animate-pulse mt-2">Uploading...</p>
          )}

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
            {newImageURLs.length > 0 &&
              newImageURLs.map((url, index) => (
                <div key={index} className="relative w-full h-28">
                  <img
                    src={url}
                    alt="Hotel's image"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
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
          disabled={uploading || isPending}
        >
          {uploading || isPending ? (
            <>
              <LoaderCircle className="animate-spin text-[#F7602C] mr-1" />{" "}
              {uploading ? (
                <span className="animate-pulse">Uploading image(s)</span>
              ) : (
                <span className="animate-pulse">Updating Hotel</span>
              )}
            </>
          ) : (
            "Update Hotel"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditHotel;