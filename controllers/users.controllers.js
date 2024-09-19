const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

const emailExist = "Email exist .. choose another one.";
const wrongImg = "The image has the wrong type ... choose image like: png or jpg or jpeg.";


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Users = require("../models/user.model");

// const upload = multer({ storage: storage })

const addUser = async ( req, res) => {

  const oldUser = await Users.findOne({ email: req.body.email });


  if (oldUser) {
    return res.json({status: "error",data: null,code: 400,msg: emailExist});
  } else {
    const { username, email, password } = req.body;

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      username: username,
      email: email,
      password: hashedPassword,
    });
    const token = jwt.sign({ password: password, email: email },process.env.S_key);

    try {
      await newUser.save();
      return res.json({status: "success",data: newUser,code: 201,msg: "Registerd 👍",token: token});
    } catch (error) {
      console.log(error,'error register');
     return res.json({
        status: "error",
        data: null,
        code: 400,
        msg: "Error in registeration",
      });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email: email });

  if (!user) {
    return res.json({ status: "error", data: null, code: 400, msg: "Wrong details" });
  }

  if (!email && !password) {
    res.json({
      status: "error",
      data: null,
      code: 400,
      msg: "Fill the form first",
    });
  }

  try {
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (user && matchedPassword) {
      const token = jwt.sign(
        { password: password, email: email },
        process.env.S_key
      );
      return res.json({
        status: "success",
        data: user,
        code: 201,
        msg: "Loged in",
        token: token,
      });
    } else {
      return res.status(400).send({
        status: "error",
        data: null,
        code: 400,
        msg: "wrong password or email",
      });
    }
  } catch (er) {
    console.log(er, "error in login");
  }
};

const verifyUser = async (req, res) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  const token = auth.split(" ")[1];

  if (token == undefined) {
    return res.json({ status: "error", data: null, code: 400, msg: "Token required" },);
  }


  try {
    const userDetails = jwt.verify(token, process.env.S_key);
    return res.json({
        status: "success",
        data: null,
        code: 200,
        msg: "User is auth",
        userDetails: userDetails,
      });
  } catch (er) {
    return res.json({
        status: "error",
        data: null,
        code: 400,
        msg: "User is not auth",
        userDetails: null,
      });
  }
};

const getUser = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  res.json({ status: "success", data: user });
};

const getUsers = async (req, res) => {
  const user = await Users.find();
  res.json({ status: "success", data: user });
};

module.exports = {
  getUser,
  getUsers,
  addUser,
  loginUser,
  verifyUser,
};
