const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const orderSchema = new Schema(
  {
    retailerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: Number,
    status: {
      type: String,
      enum: ["Confirm", "Invoiced", "shipped", "Delivered"],
      default: "Confirm",
    },
  },
  { timestamps: true }
);
const Order = model("Order", orderSchema);
