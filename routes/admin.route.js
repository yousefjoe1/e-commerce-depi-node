const { verifyAdmin, adminLogin } = require('../controllers/admin.controllers')

const exp = require('express')
const { addCategory } = require('../controllers/categories.controller')

const router = exp.Router()


router.post('/login',adminLogin)
router.get('/verify',verifyAdmin)

// categories
router.post('/category',addCategory)

module.exports = router
