const { addProductToCart, getCart,deleteUserCart, updateCart } = require('../controllers/cart.controller')

const exp = require('express')

const router = exp.Router()


router.post('/add-to-cart',addProductToCart)
router.get('/',getCart)
router.delete('/:cartId',deleteUserCart)
router.put('/:cartId',updateCart)

module.exports = router
