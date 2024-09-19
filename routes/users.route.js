const  { loginUser,verifyUser, getUsers, addUser}  = require('../controllers/users.controllers')
const exp = require('express')

const router = exp.Router()

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'api/uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
    }
  })
  
const upload = multer({ storage: storage })



router.post('/register', addUser)


router.post('/login',loginUser)
router.get('/verify-user',verifyUser)
router.get('/',getUsers)

module.exports = router
