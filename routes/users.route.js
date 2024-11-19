const  { loginUser,verifyUser, getUsers, addUser}  = require('../controllers/users.controllers')
const exp = require('express')

const router = exp.Router()

router.post('/register', addUser)
router.post('/login',loginUser)
router.get('/verify-user',verifyUser)
router.get('/',getUsers)

module.exports = router
