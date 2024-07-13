const express = require('express');
const { SignUp, Login, userVerification, getUser } = require('../controller/userC');
const router = express.Router()




router.post('/', SignUp)
router.post('/login', Login)
router.get("/verify", userVerification, getUser);




module.exports  = router