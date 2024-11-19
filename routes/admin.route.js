const { verifyAdmin, adminLogin, getProducts, updateProduct} = require('../controllers/admin.controller')

const exp = require('express')
const { addCategory } = require('../controllers/categories.controller')

const router = exp.Router()

router.get('/products',getProducts)
router.patch('/products/:productId',updateProduct)
router.post('/login',adminLogin)
router.get('/verify',verifyAdmin)

// categories
router.post('/category',addCategory)

module.exports = router
