import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ✅ ShadCN Button

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "https://new-by-kp.vercel.app";
  const backendUrl = rawBackendUrl.replace(/\/+$/, "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/blog/listBlog`);
        if (response.data && Array.isArray(response.data.blogs)) {
          setBlogs(response.data.blogs);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError("⚠️ Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center text-lg">⏳ Loading blogs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="blog-container p-6 max-w-screen-lg mx-auto">
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card p-5 shadow-lg border rounded-lg">
              {/* ✅ Blog Image - Ensure responsiveness */}
              {blog.images?.length > 0 && (
                <div className="w-full h-56 flex items-center justify-center overflow-hidden rounded-md">
                  <img
                    src={blog.images[0]}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}

              {/* ✅ Blog Title & Description */}
              <h2 className="text-xl font-semibold mt-3">{blog.title}</h2>
              <p className="text-gray-600 mt-2">{blog.description?.substring(0, 150)}...</p>

              {/* ✅ Read More Button */}
              <Button 
                onClick={() => navigate(`/blog/${blog._id}`)} 
                className="mt-3 w-full"
              >
                Read More
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
