const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const response = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {

    let token;

    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')){
        //set token from bearer token in header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token){
        //set token from cookie
        token = req.cookies.token
    }

    console.log(`Token is ${token}`);

    if(!token){
        return next(new response('Not authorize to access this route', 401));
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('decode ediliyor');
        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new response('Not authorize to access this route', 401));
    }
});