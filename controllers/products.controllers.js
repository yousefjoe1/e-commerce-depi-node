var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Products = require("../models/product.model");

const addProduct = async (req, res) => {

  try {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    const token = auth.split(" ")[1];

    if (!token) {
      return res.json({
        data: { status: "error", data: null, code: 400, msg: "Token required" },
      });
    }
    const isAdmin = jwt.verify(token, process.env.S_key);
    if (isAdmin.email != process.env.ADMIN_KEY) {
      return res.json({ data: { msg: "You need to be an admin", code: 301 } });
    }

    let defaultimg = "https://i.postimg.cc/wxtqXwss/image-For-Entry35-1s-Q.jpg";

    let img = req.body.image == "" ? defaultimg : req.body.image;
    let newProduct = new Products({
      name: req.body.name,
      price: req.body.price,
      details: req.body.details,
      in_cart: false,
      in_favorit: false,
      image: img,
      type: req.body.type
    });

    await newProduct.save();
    return res.json({ msg: "Success - product created", code: 201 }); // Created (201) status code
  } catch (error) {
    console.log(error, "error");
    return res.json({
      msg: `Error saving -- ${error.data}`,
      code: 301,
      msg2: "error in saving",
    });
  }
};

const deleteProduct = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
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

  try {
    await Products.deleteOne({ _id: req.params.productId });

    res.json({
      status: "success",
      data: null,
      code: 201,
      msg: "Product Deleted .. ",
    });
  } catch (er) {
    console.log(er, "delete errors");
    res.json({
      status: "error",
      data: null,
      code: 403,
      msg: "Product Deleted .. ",
    });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.productId;
      // const types = ["jpg", "jpeg", "png"];
      // if (!types.includes(fileType)) {
      //   return res
      //     .status(400)
      //     .send({
      //       status: "error",
      //       data: null,
      //       code: 400,
      //       msg: "The image has the wrong type ... choose image like: png or jpg or jpeg .",
      //     });
      // }

  const auth = req.headers["Authorization"] || req.headers["authorization"];
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

  let newp = { $set: { ...req.body } };

  await Products.updateOne({ _id: productId }, newp);

  try {
    res.json({ status: "success", msg: "Updated", code: 201 });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "Error Updating the product", code: 403 });
  }
};

const getProducts = async (req, res) => {
  const { q, limit } = req.query;
  if(q || limit){
    const products = await Products.find({ type: q }).limit(parseInt(limit));
    const productsLength = await Products.find({ type: q }) ;
    res.json({ status: "success", data: products,productLength: productsLength.length });
  }else{
    const products = await Products.find();
    res.json({ status: "success", data: products });
  }
};

const getProduct = async (req, res) => {  
  const product = await Products.findById(req.params.productId);
  res.json({ status: "success", data: product });
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
