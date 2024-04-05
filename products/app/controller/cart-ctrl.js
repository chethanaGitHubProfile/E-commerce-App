const Cart = require("../models/cart-model");
const Product = require("../models/product-model");
const { validationResult } = require("express-validator");
const cartCtrl = {};
cartCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { products } = req.body;
    //console.log("body Product", products);

    // Create a single GRN
    const cart = new Cart({
      products: [],
    });

    let totalQuantity = 0;
    let totalPurchasePrice = 0;
    products.forEach((elm, idx) => {
      elm.purchase_price = Math.abs(elm.margin / 100 - 100 - elm.mrp);
      (totalQuantity += elm.quantity),
        (totalPurchasePrice += elm.purchase_price);
    });
    console.log("products", products);

    // Set the calculated total quantity and purchase price to the GRN object
    cart.totalQuantity = totalQuantity;
    cart.totalPurchasePrice = totalPurchasePrice;
    console.log("PurchasePrice", totalPurchasePrice);
    cart.products = products;

    // Update the stock for each product
    for (const productData of products) {
      const { productId, quantity } = productData;
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -quantity },
      });
    }
    //console.log(cart);
    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal server Error");
  }
};

module.exports = cartCtrl;
