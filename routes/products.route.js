
const  {getProducts, addProduct, getProduct, updateProduct, deleteProduct}  = require('../controllers/products.controllers')

const exp = require('express')

const router = exp.Router()

router.get('/',getProducts)

router.post('/',addProduct)

router.get('/:productId',getProduct)

router.patch('/:productId',updateProduct)

router.delete('/:productId',deleteProduct)


module.exports = router