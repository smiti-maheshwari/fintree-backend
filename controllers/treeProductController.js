const Product = require("../models/treeProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// Create a tree product -- Admin
exports.createTreeProduct = catchAsyncErrors(async(req, res, next) => {
    req.body.treeGrower = req.user.id;
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

// create new review or update the review
exports.createProductReview = catchAsyncErrors(async(req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name, 
        rating: Number(rating), 
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === rev.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg = avg + rev.rating;
    });
    
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
    });
})

// get all reviews of a tree
exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true, 
        reviews: product.reviews
    })
})

// delete review
exports.deleteReview = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    // console.log(product);
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach(rev => {
        avg = avg + rev.rating;
    });
    
    const ratings = reviews.length === 0 ? 0 : avg / reviews.length;

    const numOfReviews = reviews.length;
    console.log(reviews, ratings)
    await Product.findByIdAndUpdate(req.query.productId, 
        {reviews, ratings, numOfReviews},
        {
            new: true, 
            runValidators: true, 
            userFindAndModify: false
        });

    res.status(200).json({
        success: true, 
     })
})