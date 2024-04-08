const Cart = require("../models/cart-model");
const Product = require("../models/product-model");
const { validationResult } = require("express-validator");
const cartCtrl = {};
cartCtrl.addToCart = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const body = req.body;
    const cartObj = { ...body };
    const productIds = cartObj.product.map((ele) => ele.productId);
    const cartProducts = await Promise.all(
      productIds.map((id) => {
        return Product.findById(id);
      })
    );
    let totalPrice = 0;
    const updateProducts = [];
    for (let i = 0; i < cartProducts.length; i++) {
      const product = cartProducts[i];
      product.stcok -= 1;
      await product.save();
      const cartProduct = {
        productId: product._id,
        quantity: 1,
        productDetails: product,
        mrp: product.mrp,
        B2BPrice: product.B2BPrice,
      };
      updateProducts.push(cartProduct);
      totalPrice += 1 * product.B2BPrice;
    }
    cartObj.totalPrice = totalPrice;
    let cart = await Cart.findOne({ retailerId: req.user.id });
    if (!cart) {
      cart = new Cart({
        retailerId: req.user.id,
        products: [],
        TotalPrice: cart[obj].TotalPrice,
      });
    }
    cart.products = updateProducts;
    await cart.save();
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

module.exports = cartCtrl;
