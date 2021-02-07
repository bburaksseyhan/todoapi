const express = require('express');
const { register,
        login,
        getMe,
        forgotPassword,
        logout
    } = require('../controllers/authcontroller');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect,  getMe);
router.post('/forgotpassword', forgotPassword);

module.exports = router;