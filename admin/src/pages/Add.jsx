import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import uploadIcon from "../assets/upload_area.png"; // Import image

const backendUrl = "http://localhost:4000";

const Add = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "Men",
      subCategory: "Topwear",
      bestseller: false,
      artistCollection: {
        art1: false,
        art2: false,
        art3: false,
        art4: false,
        art5: false,
      },
      sizes_length:"",
      sizes_breadth:"",
      images: [],
    },
  });

  const watchImages = watch("images") || [];

  // Image upload handler
  const handleImageChange = (e, index) => {    
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...watchImages];
      updatedImages[index] = file;
      setValue("images", updatedImages, { shouldValidate: true });
    }
  };

  // Toggle product size
  const toggleSize = (size) => {
    const currentSizes = watch("sizes") || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];

    setValue("sizes", newSizes, { shouldValidate: true });
  };

  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      console.log(data);

      // Convert artistCollection into separate fields
      const artistCollection = data.artistCollection || {};
      const flattenedArtistCollection = Object.keys(artistCollection).reduce((acc, key) => {
        acc[key] = artistCollection[key] ? "true" : "false";
        return acc;
      }, {});

      // Create FormData to send images
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("bestSeller", data.bestseller ? "true" : "false");

      // Append artist collection fields
      Object.entries(flattenedArtistCollection).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append sizes correctly
      data.sizes.forEach((size) => {
        formData.append("sizes", size);
      });

      // Append images
      watchImages.forEach((image, index) => {
        if (image instanceof File) {          
          formData.append(`image${index + 1}`, image);
        }
      });

      console.log(formData);
      
      // const response = await axios.post(`${backendUrl}/api/product/add`, data, {
      //   headers: {
      //     token,
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
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
      toast.error("An error occurred while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col w-full items-start gap-3">
      {/* Image Upload Section */}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img
                src={
                  watchImages[index] instanceof File
                    ? URL.createObjectURL(watchImages[index])
                    : uploadIcon
                }
                className="w-20"
                alt="Upload Preview"
              />
              <input
                type="file"
                id={`image${index}`}
                hidden
                onChange={(e) => handleImageChange(e, index)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          {...register("name", { required: true })}
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          {...register("description", { required: true })}
        />
      </div>

      {/* Category, Subcategory, and Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select className="w-full px-3 py-2" {...register("category")}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select className="w-full px-3 py-2" {...register("subCategory")}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            type="number"
            className="w-full px-3 py-2 sm:w-[120px]"
            placeholder="25"
            {...register("price", { required: true })}
          />
        </div>
      </div>

      {/* Sizes Selection */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => toggleSize(size)}>
              <p
                className={`px-3 py-1 cursor-pointer ${
                  watch("sizes")?.includes(size) ? "bg-pink-300 text-white" : "bg-gray-200"
                }`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller and Artist Collection */}
      <div className="flex gap-2 mt-2">
        <input type="checkbox" {...register("bestseller")} />
        <label>Add to bestseller</label>

        {Object.keys(watch("artistCollection")).map((key) => (
          <div key={key}>
            <input type="checkbox" {...register(`artistCollection.${key}`)} />
            <label>{key}</label>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        className="w-28 py-3 mt-4 bg-black text-white"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default Add;
