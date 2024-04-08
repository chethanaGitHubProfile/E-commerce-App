const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ProductSchema = {
  name: String,
  imagePath: String,
  mrp: Number,
  stock: {
    type: Number,
    default: 0,
  },
  reserveStock: Number,
  discount: Number,
  B2BPrice: Number,
  barcode: String,
  status: {
    type: String,
    enum: ["active", "Inactive"],
    default: "active",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
};
const Product = model("Product", ProductSchema);
module.exports = Product;
