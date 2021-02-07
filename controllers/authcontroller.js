const User = require('../models/User');
const asyncHandler = require('../middlewares/async');
const response = require('../utils/errorResponse');
const crypto = require('crypto');

//@desc  Register User
//@route  POST /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    //create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

//@desc   Login User
//@route  POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    //Validate Email && Password
    if (!email || !password) {
        return next(new response('Please provide and email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new response('Invalid credentials', 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new response('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

//Get Token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};

//@desc   Get Current User
//@route  POST /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc   Log user out/ clear cookie
//@route  GET /api/v1/auth/logout
//@access Private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});