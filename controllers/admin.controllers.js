var express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Users = require("../models/user.model");


const getUsers = async (req, res) => {
  const users = await Users.find({}, { __v: false, password: false });
  res.json({ status: "success", data: users });
};


const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await Users.findOne({ email: email });
  
  if (!user) {
    return res.json({ status: "error", data: null, code: 400, msg: "Wrong details --- you are not admin" })
  }


  try {
    const matchedPassword = await bcrypt.compare(password, user.password);
  
    const token = jwt.sign({ password: password, email: email },process.env.S_key);
    let key = process.env.ADMIN_KEY;
  
    if (user && matchedPassword) {
      if (user.email == key) {
        return res.json({status: "success", data: null, code: 200, msg: "Loged in admin",token: token});
      }
    }else {
      return res.json({status: "success", data: null, code: 404, msg: "wrong"});
    }
    
  } catch (er) {
    console.log('error',er,'error');
    return res.json({status: "Error", data: null, code: 404, msg: "Error",er:er});
  }
};


const verifyAdmin = async (req, res) => {
  const auth = req.headers['Authorization'] || req.headers['authorization']  
  const token = auth.split(' ')[1];

  if (token == undefined) {
    return res.json({data:{ status: "error", data: null, code: 400, msg: "Token required" }})
  }

  const isAdmin = jwt.verify(token,process.env.S_key)
    return res.status(200).send({status: "success", data: null, code: 200, msg: "Loged in admin",token: token});
};

const getUser = async (req, res) => {
  const user = await Users.findById(req.params.userId);
  res.json({ status: "success", data: user });
};

module.exports = {
  getUsers,
  getUser,
  adminLogin,
  verifyAdmin,
};
