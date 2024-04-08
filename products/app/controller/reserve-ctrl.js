const { validationResult } = require("express-validator");
const Reserve = require("../models/reserve-model");
const Product = require("../models/product-model");
const { format } = require("date-fns");
const cron = require("node-cron");
const _ = require("lodash");
const { productId } = require("../validations/grn-validation");
const reserveCtrl = {};

reserveCtrl.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const body = req.body;
    //console.log(body);
    const reserve = new Reserve(body);
    //console.log(reserve);
    await reserve.save();

    //if all validation tehn we are updating the "quantity" to product "stock"
    const { productId, reserveQuantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { reserveStock: reserveQuantity },
      },
      { new: true }
    );
    reserve.productId = product;
    return res.status(200).json(reserve);
  } catch (err) {
    //console.log(err);
    return res.status(500).json("Internal server error");
  }
};

reserveCtrl.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const id = req.params.id;
    const body = _.pick(req.body, ["reserveQuantity"]);
    const reserve = await Reserve.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });

    const { productId, reserveQuantity } = req.body;
    const product = await Product.findOneAndUpdate(
      productId,
      { reserveStock: reserveQuantity },
      { new: true }
    );
    reserve.product = product;
    //console.log(reserve);
    res.json(reserve);
  } catch (err) {
    res.json(err);
  }
};

reserveCtrl.softDelete = async (req, res) => {
  const id = req.params.id;
  try {
    const reserve = await Reserve.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        status: "Stopped",
      },
      { new: true }
    );

    if (!reserve) {
      return res.status(400).json({ message: "Given Reserve Id not found" });
    }

    //fetching productId from reserve object
    const productId = reserve.productId;
    //console.log(productId);
    const product = await Product.findOneAndUpdate(
      productId,
      { reserveStock: 0 },
      { new: true }
    );
    //console.log(product);

    reserve.product = product;
    const filterReserve = {
      _id: reserve._id,
      isDeleted: reserve.isDeleted,
      status: reserve.status,
      productId: reserve.productId,
    };
    res.json(filterReserve);
  } catch (err) {
    res.json(err);
  }
};

reserveCtrl.ended = async (req, res) => {
  const id = req.params.id;
  try {
    const reserve = await Reserve.findByIdAndUpdate(
      id,
      { status: "Ended" },
      { new: true }
    );
    if (!reserve) {
      return res.status(400).json({ message: "Given Reserve Id not found" });
    }
    const check =
      format(new Date(reserve.endDate), "dd/MM/yyyy") >=
      format(new Date(), "dd/MM/yyyy");
    if (check) {
      reserve.status = "Started";
    } else {
      reserve.status = "Ended";
    }

    //make reserveStock from product object to Zero
    //find productId from reserve object
    const productId = reserve.productId;

    //now make that producId of that reserve Id to Zero
    const product = await Product.findOneAndUpdate(
      productId,
      { reserveStock: 0 },
      { new: true }
    );
    reserve.product = product;

    const filterReserve = {
      _id: reserve.productId,
      status: reserve.status,
      isDeleted: reserve.isDeleted,
      productId: reserve.productId,
    };
    res.status(200).json(filterReserve);
  } catch (err) {
    res.json(err);
  }
};
module.exports = reserveCtrl;
