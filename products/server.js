require("dotenv").config();
const express = require("express");
const { checkSchema } = require("express-validator");
const cors = require("cors");
const configureDB = require("./app/config/db");
const roles = require("./utils/roles");
const stripSecretKey = require("./app/controller/payment-ctrl");
//const cron = require("node-cron");

const app = express();
app.use(express.json()); // used to read from DB
app.use(cors());

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  //defines the destination directory where uploaded file should be saved
  destination: (req, file, cb) => {
    cb(null, "images");
  },

  //It specifies how the file should be named when it's saved. In this case,
  //it's using the current timestamp concatenated with the file extension of the original uploaded file.
  filename: (req, file, cb) => {
    return cb(null, Date.now() + path.extname(file.originalname));
  },
});

//it is a multer middleware with storage confiuration defined earlier
const upload = multer({ storage: storage });

//This part sets the view engine to EJS, which means Express will use EJS
//templating engine to render views.
app.set("view engine", "ejs");

//It defines a route for GET requests to '/upload'. When a GET request is made to this endpoint,
//it renders the 'upload' view.
app.get("/upload", (req, res) => {
  res.render("upload");
});

//defines a route for POST requests to '/upload'
app.post(
  "/upload",
  (req, res, next) => {
    //It uses multer middleware to handle file uploads.
    //upload.single("images") specifies that it's expecting a single file with the field name "images".
    //The function passed as the second argument handles any errors that may occur during the file upload process.
    upload.single("images")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        res.status(400).send("Multer error occured");
      } else if (err) {
        res.status(500).send("an unknow error occured");
      } else {
        next();
      }
    });
  },
  (req, res) => {
    console.log(req.file);
    res.send("image uploaded");
  }
);

const userCtrl = require("./app/controller/user-ctrl");
const brandCtrl = require("./app/controller/brand-ctrl");
const categoryCtrl = require("./app/controller/category-ctrl");
const productCtrl = require("./app/controller/product-ctrl");
const grnCtrl = require("./app/controller/grn-Ctrl");
const reserveCtrl = require("./app/controller/reserve-ctrl");
const cartCtrl = require("./app/controller/cart-ctrl");
const invoiceCtrl = require("./app/controller/invoice-ctrl");
const paymentCtrl = require("./app/controller/payment-ctrl");

const { authenticateUser, authorizeUser } = require("./app/middlewares/auth");

const {
  userRegisterationSchema,
  userLoginSchema,
} = require("./app/validations/user-validation-schema");
const BrandValidationSchema = require("./app/validations/brand-validation");
const categorySchema = require("./app/validations/category-validation");
const productSchema = require("./app/validations/product-validation");
const grnValidationSchema = require("./app/validations/grn-validation");
const reserveValidation = require("./app/validations/reserve-validation");
const cartValidationSchema = require("./app/validations/cart-validation");
const paymentValidation = require("./app/validations/payment-validation");

const port = 3055;
configureDB();

//user authentication API
/*app.post(
  "/api/users/register",
  checkSchema(userRegisterationSchema),
  userCtrl.register
);
app.post("/api/users/login", checkSchema(userLoginSchema), userCtrl.login);
app.get("/api/users/account", authenticateUser, userCtrl.account); */

//user Apis
//user-[admin,employee]
app.post(
  "/api/user/register",
  checkSchema(userRegisterationSchema),
  userCtrl.register
); //need review
app.get("/api/user/verify/:token", userCtrl.verify); //need review
app.post("/api/user/login", checkSchema(userLoginSchema), userCtrl.login);
app.put(
  "/api/user/profileUpdate/:id",
  checkSchema(userRegisterationSchema),
  authenticateUser,
  authorizeUser(["admin", "employee"]),
  userCtrl.Update
);
app.delete(
  "/api/user/employeeDelete/:id",
  authenticateUser,
  authorizeUser(["admin", "employee"]),
  userCtrl.delete
);
app.get("/api/user/profile/:id", authenticateUser, userCtrl.profile);

//user-[vendor, retailer]
app.post(
  "/api/user/creation",
  checkSchema(userRegisterationSchema),
  authenticateUser,
  authorizeUser(["employee"]),
  userCtrl.creation
);
app.get(
  "/api/allVendors",
  authenticateUser,
  authorizeUser(["employee"]),
  userCtrl.allvendors
);
app.get(
  "/api/Vendors/:companyName",
  authenticateUser,
  authorizeUser(["employee"]),
  userCtrl.companyVendors
);

//Request Handlers for Brand -
app.get("/api/brands", brandCtrl.list);
app.post(
  "/api/brands",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(BrandValidationSchema),
  upload.single("images"),
  brandCtrl.create
);
app.put(
  "/api/brands/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  upload.single("images"),
  checkSchema(BrandValidationSchema),
  brandCtrl.update
);
app.delete(
  "/api/brands/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  brandCtrl.delete
);

//Request Handlers for Category
app.get("/api/category", categoryCtrl.list);
app.post(
  "/api/category",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(categorySchema),
  upload.single("images"),
  categoryCtrl.create
);
app.put(
  "/api/category/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(categorySchema),
  upload.single("images"),
  categoryCtrl.update
);
app.delete(
  "/api/category/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  categoryCtrl.delete
);

//Request Handler for Product
app.get(
  "/api/products",
  checkSchema(productSchema),
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  productCtrl.list
);
app.post(
  "/api/products",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam, roles.employee]),
  upload.single("images"),
  productCtrl.create
);
app.put(
  "/api/products/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(productSchema),
  upload.single("images"),
  productCtrl.update
);
app.delete(
  "/api/products/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(productSchema),
  productCtrl.delete
);
app.delete(
  "/api/products/softDelete/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam]),
  checkSchema(productSchema),
  productCtrl.softDelete
);

//Create GRN API's
app.post(
  "/api/create/GRN",
  authenticateUser,
  authorizeUser([roles.Techology, roles.buying_and_Merchant, roles.employee]),
  checkSchema(grnValidationSchema),
  grnCtrl.create
);
//app.put('/api/approveGRN/:id',authenticateUser,authorizeUser([roles.Techology,roles.buying_and_Merchant]),checkSchema(grnValidationSchema),grnCtrl.approveGRN)
//app.delete('/api/rejectGRN/:id',authenticateUser,authorizeUser([roles.Techology,roles.buying_and_Merchant]),grnCtrl.reject)

//Reservation API's
app.post(
  "/api/create/product/reservation",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam, roles.employee]),
  checkSchema(reserveValidation),
  reserveCtrl.create
);
app.put(
  "/api/product/update/reserve/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam, roles.employee]),
  reserveCtrl.update
);
app.delete(
  "/api/product/reserve/softDelete/:id",
  authenticateUser,
  authorizeUser([roles.Techology, roles.contentTeam, roles.employee]),
  checkSchema(reserveValidation),
  reserveCtrl.softDelete
); //ReserveStop Api
app.delete(
  "/api/product/resere/softDelete/ended/:id",
  authenticateUser,
  authorizeUser([roles.employee]),
  checkSchema(reserveValidation),
  reserveCtrl.ended
); //reserveEnded Api

//cart Route
app.post("/api/product/addToCart", cartCtrl.addToCart);

//Invoice API's
app.post("/api/order/invoice", invoiceCtrl.create);
app.delete("/api/order/deleteInvoice/:InvoiceId", invoiceCtrl.softDelete);

//payment Api's
app.post(
  "/api/payment",
  authenticateUser,
  authorizeUser([roles.Retailers]),
  checkSchema(paymentValidation),
  paymentCtrl.create
);
app.post(
  "/api/payment/update/:id",
  authenticateUser,
  authorizeUser([roles.Retailers]),
  paymentCtrl.update
);
app.delete(
  "/api/payment/:id",
  authenticateUser,
  authorizeUser([roles.Retailers]),
  paymentCtrl.delete
);

//node-cron
/*const task = cron.schedule("30 * * * * *", () => {
  console.log("Task submitted successfully");
});
//console.log("hello world");

setTimeout(() => {
  task.stop();
}, 2000);

setTimeout(() => {
  task.start();
}, 5000);

setTimeout(() => {
  task.stop;
}, 8000);*/

//cron
/*const cron = require("node-cron");
const Reserve = require("./app/models/reserve-model");
const Product = require("./app/models/product-model");
const { format } = require("date-fns");

cron.schedule("1 * * * * *", async () => {
  //console.log("seconds");
  try {
    const reservations = await Reserve.find({ status: "Started" });
    console.log(reservations);
    for (const reservation of reservations) {
      if (
        format(new Date(reservation.endDate), "dd/MM/yyyy") <
        format(new Date(), "dd/MM/yyyy")
      ) {
        reservation.status = "Ended";
        await reservation.save();
      }

      //Make reserveStock from product Object to Zero for reservations that ended
      const endedReservations = await Reserve.find({ status: "Ended" });
      for (const reservation of endedReservations) {
        const productId = reservation.productId;
        const product = await Product.findOneAndUpdate(
          productId,
          { reserveStock: 0 },
          { new: true }
        );
        reservation.product = product;
        await reservation.save();
        console.log("Cron job executed successfully");
      }
    }
  } catch (err) {
    console.log("error occured during cron job", err);
  }
});
*/

app.listen(port, () => {
  console.log("products collection is running successfully on port" + port);
});
