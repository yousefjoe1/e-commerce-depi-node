const  { getUsers,verifyUser}  = require('../controllers/vendor.controllers')
const exp = require('express')

const router = exp.Router()

router.get('/',getUsers)
router.get('/verify-vendor',verifyUser)

module.exports = router
