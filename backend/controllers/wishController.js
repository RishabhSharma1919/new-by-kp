import wishModel from "../models/wishModel.js";

export const addtowish = async (req, res) => {
  console.log("add to wish started");

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Userioi ID is required" });
    }

    const { itemId, wish } = req.body;

    if (!itemId || wish === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let Wishi = await wishModel.findOne({ userId });

    console.log("Current wishlist:", Wishi);

    if (!Wishi) {
      Wishi = new wishModel({ userId, items: [] });
      await Wishi.save();
    }

    if (wish) {
      // Add item if `wish` is true and not already present
      const itemExists = Wishi.items.some((item) => item.itemId === itemId);
      if (!itemExists) {
        Wishi.items.push({ itemId, wish });
      }
    } else {
      // Remove item if `wish` is false
      console.log("Removing item from wishlist");
      Wishi.items = Wishi.items.filter((item) => item.itemId !== itemId);
    }

    await Wishi.save();

    return res.status(200).json({ success: true, message: "Wishlist updated successfully", wishlist: Wishi.items });

  } catch (error) {
    console.error("Error updating wishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removefromWish = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("Reached remove from wish");

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const Wishi = await wishModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { itemId } } },
      { new: true }
    );

    if (!Wishi) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    return res.json({ success: true, message: "Item removed from wishlist", Wishi });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getuserwishlist = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const wishlist = await wishModel.findOne({ userId });
   //console.log("inside getUserWishlist", wishlist);

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
