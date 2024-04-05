const { validationResult } = require("express-validator");
const Product = require("../models/product-model");
const productCtrl = {};

//list
productCtrl.list = async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    res.json(err);
  }
};

//productCtrl is a asynchronus function responsible for creating a new product
productCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //extract req body from request object
  const body = req.body;

  //extract req file from request object
  const file = req.file;

  //it checks if a file has been uploaded. if not it returns 401 status error
  if (!file) {
    return res.status(401).json({ errros: "No file Uploaded" });
  }

  //extracts mrp from request object
  const mrp = body.mrp;

  //extracts tax from request object
  const tax = body.tax;

  //it calculates B2Bprice
  const B2BPrice = Math.abs(Math.round((tax / 100) * mrp - mrp));

  //it assigns calculated B2Bprice to property in request body
  body.B2BPrice = B2BPrice;

  //it assigns file path to 'image path' property in request body
  const imagePath = file.path;
  body.imagePath = imagePath;

  //creates a new product object using request object
  const product = new Product(body);
  try {
    //attempts to save the product in db
    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

//update
productCtrl.update = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const file = req.file;
  if (!file) {
    return res.status(401).json({ errros: "no file upoloaded" });
  }
  const mrp = body.mrp;
  const tax = body.tax;
  const B2BPrice = Math.abs(Math.round((tax / 100) * mrp - mrp));
  body.B2BPrice = B2BPrice;
  try {
    const imagePath = req.file.filename;
    const product = await Product.findByIdAndUpdate(
      id,
      { ...body, imagePath },
      { new: true, runValidators: true }
    );
    console.log(product);
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

productCtrl.delete = async (req, res) => {
  const id = req.id;
  try {
    const product = await Product.findByIdAndDelete({ _id: req.params.id });
    res.json(product);
  } catch (err) {
    res.json(err);
  }
};

//productCtrl is asynchronous function responsible for softDelete.
productCtrl.softDelete = async (req, res) => {
  //extracts id from  requested url
  const id = req.params.id;
  try {
    //it sets isDeleted to true and deleted Date
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.json(err);
  }
};

module.exports = productCtrl;
