import { useState, useEffect, } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import uploadIcon from "../assets/upload_area.png";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://new-by-kp-cykh.vercel.app";
const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "Devotional",
      subCategory: "small A4",
      bestSeller: false,
      art1: false,
      art2: false,
      art3: false,
      art4: false,
      art5: false,
      length: "30",
      breadth: "21",
      size: "Normal A4",
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

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Product added successfully!");
        reset();
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred while adding the product.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const artSections = [
    { field: "bestSeller", label: "Best Seller", badge: "Home Spotlight", desc: "Highlight in Best Sellers & Home Spotlight" },
    { field: "art1", label: "Personalised Works", badge: "Painters", desc: "Featured in Personalised Works / Painters category" },
    { field: "art2", label: "Modern Artworks", badge: "Sculptors", desc: "Featured in Modern Art / Sculptors category" },
    { field: "art3", label: "Digital Creations", badge: "Photographers", desc: "Featured in Digital Creations / Photographers category" },
    { field: "art4", label: "Classic Masterpieces", badge: "Designers", desc: "Featured in Classic Masterpieces / Designers category" },
    { field: "art5", label: "Special Collection", badge: "Illustrators", desc: "Featured in Special Art / Illustrators category" },
  ];

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
        <p className="mb-2">Product Name</p>
        <input className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" {...register("name", { required: true })} />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea className="w-full max-w-[500px] px-3 py-2" placeholder="Write content here" {...register("description", { required: true })} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <select className="w-full px-3 py-2" {...register("category")}>
          <option value="Devotional">Devotional</option>
          <option value="Scenery">Scenery</option>
          <option value="Anime">Anime</option>
        </select>

        <select className="w-full px-3 py-2" {...register("subCategory")}>
          <option value="small A4">small A4</option>
          <option value="medium">medium</option>
          <option value="large">large</option>
        </select>

        <input type="number" className="w-full px-3 py-2 sm:w-[120px]" placeholder="25" {...register("price", { required: true })} />
      </div>

      <div className="flex gap-2">
        <input type="number" placeholder="Length" className="px-2 py-1 border" {...register("length", { required: true })} />
        <input type="number" placeholder="Breadth" className="px-2 py-1 border" {...register("breadth", { required: true })} />
      </div>

      <div className="w-full">
        <p className="mb-2">Size</p>
        <input className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" {...register("size")} />
      </div>

      <div className="w-full max-w-[650px] mt-2">
        <p className="font-semibold text-gray-700 mb-1">Curation & Gallery Collections</p>
        <p className="text-xs text-gray-500 mb-3">Select which app and web gallery sections this artwork should appear in:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {artSections.map(({ field, label, badge, desc }) => (
            <label
              key={field}
              className="flex items-start gap-3 p-3 border rounded-lg hover:border-black cursor-pointer transition bg-white"
            >
              <input type="checkbox" className="mt-1 w-4 h-4 cursor-pointer" {...register(field)} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-800">{label}</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button className="w-28 py-3 mt-4 bg-black text-white disabled:opacity-50" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default Add;
