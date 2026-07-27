import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    cartData: { type: Object, default: {} }, //If the field is empty then mongoose will definetely trim the cardData part
    address: { type: Array, default: [] },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    country: { type: String, default: "" },
    language: { type: String, default: "English (UK) - English" },
    gender: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { minimize: false, timestamps: true },
); //That is why we use minimize so that it can't be trimed..

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;