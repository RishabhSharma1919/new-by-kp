import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UpdateBlog = () => {
  const { id } = useParams(); // Ensure correct parameter name
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // New images
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app").replace(/\/+$/, "");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/single/${id}`);
        setBlog(data.blog);
        setTitle(data.blog.title);
        setDescription(data.blog.description);
      } catch (err) {
        setMessage("Failed to load blog.");
      }
    };

    fetchBlog();
  }, [id]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!title && !description && images.length === 0) {
      setMessage("No changes detected.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      images.forEach((image) => formData.append("images", image));

      await axios.put(`${backendUrl}/api/blog/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if required
        },
      });

      setMessage("Blog updated successfully!");
    } catch (error) {
      setMessage("Error updating blog.");
    } finally {
      setLoading(false);
    }
  };

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div>
      <h2>Update Blog</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleUpdate}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        
        <div>
          <h3>Current Images</h3>
          {blog.images?.length > 0 ? (
            blog.images.map((img, idx) => (
              <img key={idx} src={img} alt={`Blog image ${idx}`} width="100" />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <input type="file" multiple onChange={handleImageChange} accept="image/*" />
        <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Blog"}</button>
      </form>
    </div>
  );
};

export default UpdateBlog;
