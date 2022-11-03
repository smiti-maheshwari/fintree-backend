const Product = require("../models/treeProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// Create a tree product -- Admin
exports.createTreeProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// Get all tree products
exports.getAllProducts = catchAsyncErrors(async(req, res) => {
    
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search().filter().pagination(resultPerPage)

    const products = await apiFeature.query;

    res.status(200).json({
        success: true, 
        products,
        productCount
    })
})

// get product details
exports.getTreeProductDetails = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Tree Not Found!", 404));
    }

    res.status(200).json({
        success: true,
        product
    })
})

// Update product -- Admin
exports.updateTreeProduct = catchAsyncErrors(async(req, res, next) => {
    let product = Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Tree Not Found!", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
})

// delete product
exports.deleteTreeProduct = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product) {
        return next(new ErrorHandler("Tree Not Found!", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Tree Product Deleted Successfully!"
    })
})

