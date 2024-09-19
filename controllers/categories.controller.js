var express = require("express");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Categories = require("../models/category.model");

const addCategory = async (req, res) => {
  
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
  
  
      const newCategory = new Categories({
        name: req.body.name,
        image: ''
      });
      await Categories.save();
      res.status(201).send(newCategory); // Created (201) status code
    } catch (error) {
      console.log(error);
      res.status(500).send("Error saving product");
    }
  };

  
module.exports = {
    addCategory,
  };
  