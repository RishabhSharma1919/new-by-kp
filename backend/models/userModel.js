import { Resend } from "resend";
import mongoose, { mongo } from "mongoose";
import validator from "validator";

const resend = new Resend(process.env.RESEND_API_KEY);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.verifyStatus;
      },
    },
    email: {
      type: String,
      required: true,  // Always required for verification
      unique: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: function () {
        return this.verifyStatus;  // ✅ Now required only if verifyStatus is true
      },
      minlength: [8, "Password must be at least 8 characters long"],
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    verifyStatus: {
      type: Boolean,
      default: false,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
