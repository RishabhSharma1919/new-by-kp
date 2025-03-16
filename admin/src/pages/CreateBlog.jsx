import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import uploadIcon from "../assets/upload_area.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CreateBlog = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      images: [],
    },
  });

  const watchImages = watch("images") || [];

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...watchImages];
      updatedImages[index] = file;
      setValue("images", updatedImages, { shouldValidate: true });
    }
  };

  useEffect(() => {
    return () => {
      watchImages.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [watchImages]);

  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
      });
      watchImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`image${index + 1}`, image);
        }
      });

      const response = await axios.post(`${backendUrl}/api/blog/create`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success) {
        toast.success(response.data.message);
        reset();
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                src={watchImages[index] instanceof File ? URL.createObjectURL(watchImages[index]) : uploadIcon}
                className="w-20"
                alt="Upload Preview"
              />
              <input type="file" id={`image${index}`} hidden accept="image/*" onChange={(e) => handleImageChange(e, index)} />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Blog Title</p>
        <input className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Enter title" {...register("title", { required: true })} />
      </div>

      <div className="w-full">
        <p className="mb-2">Blog Description</p>
        <textarea className="w-full max-w-[500px] px-3 py-2" placeholder="Write content here" {...register("description", { required: true })} />
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white disabled:opacity-50" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Blog"}
      </button>
    </form>
  );
};

export default CreateBlog;
