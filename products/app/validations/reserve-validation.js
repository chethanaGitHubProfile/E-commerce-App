const Product = require("../models/product-model");
const reserveValidation = {
  productId: {
    notEmpty: {
      errorMessage: "productId is required",
    },
    custom: {
      options: async function (value, { req }) {
        const product = await Product.findOne({ _id: value });
        console.log(product);
        if (!product) {
          throw new Error("Product not found with the provided productId");
        } else {
          return true;
        }
      },
    },
    reserveQuantity: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be in Integer",
      },
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          return date instanceof Date && !isNaN(date); //isNaN() returns true for values that are not numeric,
          // !isNaN() returns true for values that are numeric.
        },
        message: "Invalid start date",
      },
      endDate: {
        type: Date,
        required: true,
        custom: {
          options: async function (value, { req }) {
            if (value > req.body.startDate) {
              throw new Error("endDate must be greater than startDate");
            }
          },
        },
      },
    },
  },
};
module.exports = reserveValidation;
