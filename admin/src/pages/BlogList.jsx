import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app").replace(/\/+$/, "");

const BlogList = ({ token }) => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/blog/listBlog`);
      if (response.data.success) {
        setBlogs(response.data.blogs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading blogs.");
    }
  };

  // Handle blog deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await axios.delete(`${backendUrl}/api/blog/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Blog deleted successfully.");
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting blog.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <p className="mb-2">All Blogs List</p>
      <div className="flex flex-col gap-2">
        {/* Blog Table Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_2fr_1fr_1fr] items-center py-1 px-2 border text-sm bg-gray-100">
          <b>Title</b>
          <b>Author</b>
          <b>Description</b>
          <b>Readers Count</b>
          <b className="text-center">Actions</b>
        </div>

        {/* Blog List */}
        {blogs.map((blog, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1fr] md:grid-cols-[2fr_1fr_2fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <p>{blog.title}</p>
            <p>{blog.author}</p>
            <p className="truncate">{blog.description}</p>
            <p>{blog.readers?.length || 0}</p>

            <div className="flex gap-2 justify-end md:justify-center">
            <Link to={`/update/${blog._id}`} className="text-blue-600 underline">Edit
              </Link>
              <span
                onClick={() => handleDelete(blog._id)}
                className="cursor-pointer text-lg text-red-600"
              >
                X
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogList;
