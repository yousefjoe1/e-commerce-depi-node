var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Products = require("../models/product.model");
const User = require("../models/user.model");

const addProduct = async (req, res) => {
  try {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    const token = auth.split(" ")[1];

    if (!token) {
      return res.json({
        data: { status: "error", data: null, code: 400, msg: "Token required" },
      });
    }

    const vendor = jwt.verify(token, process.env.S_key);
    const user = await User.findOne({ email: vendor.email }); // The authenticated user

    if (user.role !== "vendor") {
      return res.json({
        msg: "Access denied. Only vendors can add products.",
        code: 301,
        status: "error",
      });
    }

    // const isAdmin = jwt.verify(token, process.env.S_key);
    // if (isAdmin.email != process.env.ADMIN_KEY) {
    //   return res.json({ data: { msg: "You need to be an admin", code: 301 } });
    // }

    let newProduct = new Products({
      name: req.body.name,
      price: req.body.price,
      details: req.body.details,
      images: req.body.images,
      discount: req.body.discount,
      category: req.body.category,
      sub_category: req.body.sub_category,
      colors: req.body.colors,
      sizes: req.body.sizes,
      dress: req.body.dress,
      rate: req.body.rate,
      vendor: user._id,
    });

    console.log(newProduct, "new products");

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

  
  const vendor = jwt.verify(token, process.env.S_key);
  const user = await User.findOne({ email: vendor.email }); // The authenticated user

  // const isAdmin = jwt.verify(token, process.env.S_key);
  // if (isAdmin.email != process.env.ADMIN_KEY) {
  //   return res.json({ msg: "You need to be an admin", code: 301 });
  // }

  if (user.role !== "vendor") {
    return res.json({
      msg: "Access denied. Only vendors can add products.",
      code: 301,
      status: "error",
    });
  }


  let currentProduct = await Products.findById(productId);
  // console.log("🚀 ~ updateProduct ~ currentProduct:", currentProduct)
  let show = currentProduct.show;

  let newp = { $set: { ...req.body, show: show} };
  console.log("🚀 ~ updateProduct ~ newP:", newp)


  await Products.updateOne({ _id: productId }, newp);
  

  try {
    res.json({ status: "success", msg: "Updated", code: 201 });
  } catch (error) {
    console.error(error);
    res.json({ status: "error", msg: "Error Updating the product", code: 403 });
  }
};

const getProducts = async (req, res) => {
  const {
    q,
    count,
    color,
    minPrice,
    maxPrice,
    size,
    category,
    dress,
    extraQuery,
  } = req.query;

  const query = {show: true};

  if (color) query.colors = { $in: [color] };
  if (dress) query.dress = dress;
  if (minPrice) query.price = { $gte: parseInt(minPrice) };
  if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
  if (size) query.size = { $in: [size] };
  if (category) query.category = category;


  // Todo : Extra query handle it all (new-arrivals - top selling), assign it to products
  // ? Top selling will know it after payments analysise
  if (extraQuery == "new-arrivals") {
    const totalCount = await Products.countDocuments(query);

    // Calculate the number of products that represent 20% of the total
    const twentyPercentCount = Math.ceil(totalCount * 0.2); // round up to the nearest integer

    // Calculate the starting index to fetch the last 20%
    const skip = Math.max(0, totalCount - twentyPercentCount);

    // ? IF count , get with the count --> else get with 20%
    const countOrPercent = count !== undefined ? count : twentyPercentCount

    // Fetch the last 20% of products (sorted by date or other criteria)
    const products = await Products.find(query)
      .sort({ createdAt: -1 }) // Assuming there's a `createdAt` field to sort by
      .skip(skip) // Skip products until the last 20% is reached
      .limit(countOrPercent); // Limit to 20% of the total products
    return res.json({ status: "success", data: products });
  }
  const products = await Products.find(query).limit(parseInt(count));
  res.json({ status: "success", data: products });
};

const getProduct = async (req, res) => {
  const product = await Products.findById(req.params.productId);
  res.json({ status: "success", data: product });
};

const getVendorProducts = async (req, res) => {
  try {
    const auth = req.headers["Authorization"] || req.headers["authorization"];
    if (auth == undefined) {
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

    const vendor = jwt.verify(token, process.env.S_key);
    const user = await User.findOne({ email: vendor.email }); // The authenticated user

    if (user.role !== "vendor") {
      return res.json({
        msg: "Access denied. Only vendors can add products.",
        code: 301,
        status: "error",
      });
    }

    // send products
    const products = await Products.find({ vendor: user._id,show: true });
    res.json({ status: "success", data: products, code: 200 });
  } catch (er) {
    res.json({ status: "error", code: 400, msg: "error get products" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
};
