import { Heart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify"; // Ensure toast is imported

const WishlistButton = ({ productData }) => {
  const { wishitems, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const [isInWishlist, setIsInWishlist] = useState(false);

  //console.log("Wishlist items inside button:", wishitems);
  //console.log("Type of wishitems:", typeof wishitems);

  useEffect(() => {
    if (!Array.isArray(wishitems)) {
      //console.warn("Wishlist items is not an array:", wishitems);
      return;
    }

    //console.log(`🔍 Checking Wishlist for Product ID: ${productData._id}`);

    let found = false;

    wishitems.forEach((item, index) => {
      //console.log(`🔎 Checking item ${index + 1}/${wishitems.length}:`, item);
      
      if (String(item.itemId) === String(productData._id)) {
       // console.log(`✅ Match found at index ${index}:`, item);
        found = true;
      }
    });

    if (!found) {
      //console.log(`❌ No match found for Product ID: ${productData._id}`);
    }

    setIsInWishlist(found);
  }, [wishitems, productData]);

  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        //console.log("🗑️ Removing from Wishlist:", productData._id);
        await removeFromWishlist(productData._id);
        toast.success("Removed from wishlist!");
      } else {
        //console.log("➕ Adding to Wishlist:", productData._id);
        await addToWishlist({ _id: productData._id }); // Send only necessary data
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      //console.error("⚠️ Wishlist operation failed:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <Button 
      onClick={handleWishlistToggle} 
      variant="outline" 
      className="mt-3 flex items-center gap-2"
    >
      <Heart 
        className={`w-5 h-5 transition-all ${
          isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
        }`} 
      />
      {isInWishlist ? "" : ""}
    </Button>
  );
};

export default WishlistButton;
