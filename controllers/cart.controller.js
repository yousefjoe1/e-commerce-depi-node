var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const Cart = require("../models/cart.model");
const Users = require("../models/user.model");

const addProductToCart = async (req, res) => {
  
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    if (!auth) {
      return res.json({ status: "error", data: null, code: 400, msg: "Login First" },);
    }

    if (token == undefined) {
      return res.json({ status: "error", data: null, code: 400, msg: "Login First" });
    }

    const isUser = jwt.verify(token, process.env.S_key);

    const userId = await Users.findOne({ email: isUser.email });
    const product_id = req.body.product._id;

    const userCart = await Cart.find({ user_id: userId._id });
    const filterdCart = userCart.filter((p) => p.product._id == product_id);

    if (filterdCart.length != 0) {
      return res.status(201).send({stauts: 'success', in_cart: true });
    }
    const newProduct = new Cart({
      user_id: userId._id,
      product: req.body.product,
      count: req.body.count,
    });
    await newProduct.save();
    res.json({ status: "success", data: newProduct, code: 201, msg: "Product saved in the cart" })
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving product");
  }
};

const getCart = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  const token = auth.split(" ")[1];

  try {
    if (!auth) {
      return res.json({ status: "error", data: null, code: 400, msg: "Login First"});
    }

    if (token == undefined) {
      return res.json({ status: "error", data: null, code: 400, msg: "Login First" });
    }

    const isUser = jwt.verify(token, process.env.S_key);

    const email = await Users.findOne({ email: isUser.email });

    if (email.email == isUser.email) {
      let t=0
      const cart = await Cart.find({ user_id: email._id });
      cart.forEach(el=>{
        let c = +el.count * el.product.price
        t += c
      })

      res.json({ status: "success", data: cart, total: t ,sub_total: 0});
    } else {
      res.json({ status: "error", data: [] });
    }
  } catch (er) {
    res.json({ status: "error", data: [] });
  }
};

const updateCart = async (req, res) => {
  const productId = req.params.cartId;

  const newProductObj = { $set: { ...req.body } };

  await Cart.updateOne({ _id: productId }, newProductObj);

  try {
    res.json({ status: "success", code: 201 }); // Created (201) status code
  } catch (error) {
    console.error(error);
    res.json({ status: "error", code: 301 });
  }
};

const deleteUserCart = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];

  if (!auth) {
    return res.json({
      data: { status: "error", data: null, code: 400, msg: "Login First" },
    });
  }
  const token = auth.split(" ")[1];

  if (!token) {
    return res.json({
      data: { status: "error", data: null, code: 400, msg: "Login First" },
    });
  }

  try {
    const isUser = jwt.verify(token, process.env.S_key);
    const email = await Users.findOne({ email: isUser.email });

    if (email.email == isUser.email) {
      await Cart.deleteOne({ _id: req.params.cartId });
      res.json({ status: "success", data: null, msg: "Product deleted" });
    } else {
      res.json({ status: "error", data: null, msg: "You need to login" });
    }
  } catch (er) {
    res.json({ status: "error", data: null, msg: "error deleting cart item" });
  }
};

module.exports = {
  addProductToCart,
  getCart,
  updateCart,
  deleteUserCart,
};
