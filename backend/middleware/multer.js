import multer from "multer";
import path from "path";

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "uploads/"); // Ensure "uploads/" directory exists
//   },
//   filename: function (req, file, callback) {
//     const uniqueSuffix = Date.now() + path.extname(file.originalname);
//     callback(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });
const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

//




const upload = multer({ storage });

export default upload;
