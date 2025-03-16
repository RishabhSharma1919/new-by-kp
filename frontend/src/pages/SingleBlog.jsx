import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SingleBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/blog/single/${blogId}`)
      .then((res) => {
        setBlog(res.data.blog);
        setLikes(res.data.blog.likes || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching blog:", err);
        setError("⚠️ Failed to load blog. Please try again.");
        setLoading(false);
      });
  }, [blogId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return alert("Please log in to like/unlike the blog!");
      }

      const response = await axios.patch(
        `${backendUrl}/api/blog/like`,
        { id: blogId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setLikes(response.data.likes);
        setLiked(response.data.liked);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("❌ Error liking/unliking blog:", err);
      alert("⚠️ Failed to update like status. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-lg text-[#D6D6C7]">⏳ Loading...</p>;
  if (!blog) return <p className="text-center text-red-500">{error || "❌ Blog not found!"}</p>;

  return (
    <div className="p-6 text-[#D6D6C7] bg-[#262B2B] min-h-screen">
      {/* ✅ Blog Title & Info */}
      <h1 className="text-4xl font-bold">{blog.title}</h1>
      <p className="text-gray-400 mt-2">{blog.description}</p>
      <p className="text-sm text-gray-500 mt-1">
        Author: {blog.author} | Views: {blog.views}
      </p>

      {/* ✅ Featured Image (Larger) */}
      {blog.images?.length > 0 && (
        <div className="mt-8 relative">
          <img
            src={blog.images[0]}
            alt="Main Blog"
            className="w-full h-[500px] object-cover rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelectedImage(blog.images[0])}
          />
          <Maximize
            className="absolute top-4 right-4 w-6 h-6 text-[#D6D6C7] cursor-pointer hover:scale-110"
            onClick={() => setSelectedImage(blog.images[0])}
          />
        </div>
      )}

      {/* ✅ Other Images Grid (Clickable for Full-Screen) */}
      {blog.images?.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {blog.images.slice(1).map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`Blog Image ${index + 2}`}
                className="w-full h-48 object-cover rounded-md shadow-md cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />
              <Maximize
                className="absolute top-2 right-2 w-5 h-5 text-[#D6D6C7] cursor-pointer hover:scale-110"
                onClick={() => setSelectedImage(img)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ✅ Like Button */}
      <Button
        onClick={handleLike}
        variant="outline"
        className="mt-6 flex items-center gap-2 text-[#D6D6C7] border-[#D6D6C7] hover:bg-[#333A3A]"
      >
        <Heart
          className={`w-5 h-5 transition-all ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
        />
        {likes} {likes === 1 ? "Like" : "Likes"}
      </Button>

      {/* ✅ Full-Screen Image Modal (Fixed Accessibility Issues) */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="p-2 bg-black max-w-4xl mx-auto">
            <DialogTitle>
              <VisuallyHidden>Expanded Image View</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>This is a full-screen view of the selected image.</VisuallyHidden>
            </DialogDescription>
            <img
              src={selectedImage}
              alt="Full Screen"
              className="w-full h-auto rounded-md max-h-[90vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SingleBlog;
