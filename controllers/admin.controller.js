var express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Users = require("../models/user.model");
const Products = require("../models/product.model");

const getUsers = async (req, res) => {
  const users = await Users.find({}, { __v: false, password: false });
  res.json({ status: "success", data: users });
};

const getProducts = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  
  if (auth == undefined || auth == 'null' || auth == 'undefined') {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }
  const token = auth.split(" ")[1];

  if (token == undefined || token == 'null' || token == 'undefined') {
    return res.json({ status: "error", data: null, code: 400, msg: "Token required" });
  }

  const isAdmin = jwt.verify(token, process.env.S_key);
  if (isAdmin.email != process.env.ADMIN_KEY) {
    return res.json({ msg: "You need to be an admin", code: 301 });
  }
  
  const count = req.query.count

  const productsData = await Products.find().limit(count);
  res.json({ status: "success", data: productsData });
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });

  if (!user) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Wrong details -- you are not admin",
    });
  }

  try {
    const matchedPassword = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      { password: password, email: email },
      process.env.S_key
    );
    let key = process.env.ADMIN_KEY;

    if (user && matchedPassword) {
      if (user.email == key) {
        return res.json({
          status: "success",
          data: null,
          code: 200,
          msg: "Loged in admin",
          token: token,
        });
      }
    } else {
      return res.json({
        status: "success",
        data: null,
        code: 404,
        msg: "wrong",
      });
    }
  } catch (er) {
    console.log("error", er, "error");
    return res.json({
      status: "Error",
      data: null,
      code: 404,
      msg: "Error",
      er: er,
    });
  }
};

const verifyAdmin = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  
  if (auth == undefined || auth == 'null' || auth == 'undefined') {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }
  const token = auth.split(" ")[1];

  if (token == undefined || token == 'null' || token == 'undefined') {
    return res.json({ status: "error", data: null, code: 400, msg: "Token required" });
  }

  try {
    const isAdmin = jwt.verify(token, process.env.S_key);
    return res.json({
        status: "success",
        data: null,
        code: 200,
        msg: "User is auth",
        admin: isAdmin,
      });
  } catch (er) {
    return res.json({
        status: "error",
        data: null,
        code: 400,
        msg: "User is not auth",
        admin: null,
      });
  }
};

const getUser = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  res.json({ status: "success", data: user });
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;


  const auth = req.headers["Authorization"] || req.headers["authorization"];

  if (auth == undefined || auth == null) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }

  const token = auth.split(" ")[1];

  if (!token) {
    return res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Token required",
    });
  }

  const isAdmin = jwt.verify(token, process.env.S_key);
  if (isAdmin.email != process.env.ADMIN_KEY) {
    return res.json({ msg: "You need to be an admin", code: 301 });
  }
  

  // let currentProduct = await Products.findById(productId);
  // console.log("🚀 ~ updateProduct ~ currentProduct:", currentProduct)

  let newp = { $set: { ...req.body} };
  // console.log("🚀 ~ updateProduct ~ newP:", newp)


  await Products.updateOne({ _id: productId }, newp);
  
  try {
    res.json({ status: "success", msg: "Updated", code: 201 });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "Error Updating the product", code: 403 });
  }
};

module.exports = {
  getUsers,
  getUser,
  adminLogin,
  verifyAdmin,
  getProducts,
  updateProduct
};
