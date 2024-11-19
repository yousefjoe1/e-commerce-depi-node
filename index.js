var express = require('express')
var bodyParser = require('body-parser')

require('dotenv').config()

var app = express()
const cors = require('cors');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
// parse application/json
app.use(bodyParser.json())

const url = process.env.USER_ID;

const mongoose = require('mongoose')

mongoose.connect(url).then(res=> {
    console.log('mongoose done');
})

const productsRouter = require('./routes/products.route')
const userRouter = require('./routes/users.route')
const adminRouter = require('./routes/admin.route')
const cartRouter = require('./routes/cart.route')
const vendorRouter = require('./routes/vendor.route')

app.use('/api/products',productsRouter)
app.use('/api/users',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/cart',cartRouter)
app.use('/api/vendors',vendorRouter)


app.listen(4000,()=>{
    console.log('server running');
})