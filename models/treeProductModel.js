const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Tree's Name"],
        trim: true
    }, 
    description: {
        type: String, 
        required: [true, "Please Enter Tree's Description"]
    }, 
    treeGrower: {
        type: mongoose.Schema.ObjectId,
        ref: "User", 
        required: true
    },
    price: {
        type: Number, 
        required: [true, "Please Enter Tree's Price"],
        maxLength: [8, "Price cannot exceed 8 figures"]
    }, 
    currency: {
        type: String, 
        required: [true, "Please Enter Currency for Tree's Price"]
    },
    location: {
        type: String, 
        required: [true, "Please Enter Tree's Location"]
    },
    ratings: {
        type: Number,
        default: 0
    }, 
    images: [{
        public_id: {
            type: String, 
            required: true
        },
        url: {
            type: String, 
            required: true
        }
    }],
    category: {
        type: String, 
        required: [true, "Please Enter Tree's Category"]
    },
    stock: {
        type: Number, 
        required: [true, "Please Enter Tree's Stock"],
        maxLength: [20, "Stock connot exceed 20 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number, 
        default: 0
    }, 
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User", 
                required: true
            },
            name: {
                type: String, 
                required: true,
            },
            rating: {
                type: Number, 
                required: true,
            }, 
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("TreeProduct", productSchema);