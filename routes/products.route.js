
const  {getProducts, addProduct, getProduct, updateProduct, deleteProduct, getVendorProducts}  = require('../controllers/products.controllers')

const exp = require('express')

const router = exp.Router()

router.get('/',getProducts)

router.get('/vendor-products',getVendorProducts)

router.post('/',addProduct)

router.get('/:productId',getProduct)

router.patch('/:productId',updateProduct)

router.delete('/:productId',deleteProduct)


module.exports = router