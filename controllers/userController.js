const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");

// register a user
exports.registerUser = catchAsyncErrors(async(res, req, next) => {

    const {name, email, password} = req.body;
    const user = await User.create();
    
})