const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/treeProductModel");

// cerate new order
exports.newOrder = catchAsyncErrors(async(req, res, next) => {
    const {
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice, 
        shippingPrice,
        totalPrice
    } = req.body;
    const order = await Order.create({
        orderItems,
        paymentInfo, 
        itemsPrice,
        taxPrice, 
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        success: true, 
        order
    })
})

// get single order
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true, 
        order
    });
})

// get logged in user's order
exports.myOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find({user: req.user._id});
    res.status(200).json({
        success: true, 
        orders
    });
})

// get all orders --admin
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        success: true, 
        totalAmount,
        orders
    });
})

// update order status --admin
exports.updateOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    if(order.orderStatus === "Grown") {
        return next(new ErrorHandler("You have already fulfilled the order", 400));
    }
    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
    })
    order.orderStatus = req.body.status;
    
    if(req.body.status === "Grown") {
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave: false});    res.status(200).json({
        success: true, 

    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave: false});
}

// delete order --admin
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }
    await order.remove();
    res.status(200).json({
        success: true,
    });
})