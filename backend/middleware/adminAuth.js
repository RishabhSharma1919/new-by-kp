import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    //console.log("Admin Auth Header:", req.headers.authorization);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "NOT AUTHORIZED, LOGIN AGAIN!" });
    }

    const token = req.headers.authorization.split(" ")[1];
    //console.log("Extracted Admin Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded Admin Token:", decoded);

    // Check if the email matches the admin email
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Unauthorized Admin Access!" });
    }

    req.admin = { email: decoded.email }; // Attach admin email to request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    //console.error("🔥 Admin Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid Admin token. Please login again." });
  }
};

export default adminAuth;
