// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     // console.log("Auth Header:", req.headers.authorization);
// console.log(req);

//     if ((!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) && !req.user.id) {
//       return res.status(401).json({ success: false, message: "NOT AUTHORIZED, LOGIN AGAIN!" });
//     }

//     const token = req.headers.authorization.split(" ")[1];
//     console.log("Extracted Token:", token);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded);

//     req.user = { id: decoded.id };
//     next();
//   } catch (error) {
//     console.log("Auth Error:", error.message);
//     return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
//   }
// };

// export default authUser;

import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    
    //console.log("Auth Header reached here:", req.headers.authorization);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "NOT AUTHORIZED, LOGIN AGAIN!" });
    }

    const token = req.headers.authorization.split(" ")[1];
    //console.log("Extracted Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // console.log("Decoded Tokeni:", decoded);

    req.user = { id: decoded.id }; // Attach user ID to request
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    //console.error("🔥 Auth Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
  }
};

export default authUser;
