const mongoose = require("mongoose");

const adminProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    available: { type: Boolean, default: true },
    sku: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Men", "Women", "Unisex"], required: true },
    sizes: [{ type: String }], // ["S", "M", "L", "XL"]
    material: { type: String },
    category: { type: String },
    collection: { type: String },
    colors: [{ type: String }], // ["Red", "Blue"]
    imageUrl: { type: String, required: true }, // from Cloudinary
  },
  { timestamps: true }
);

module.exports = mongoose.model("adminProductSchema", adminProductSchema)