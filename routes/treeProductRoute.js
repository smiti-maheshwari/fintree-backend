const express = require("express");
const { getAllProducts, createTreeProduct, updateTreeProduct, deleteTreeProduct, getTreeProductDetails, createProductReview, getProductReviews, deleteReview } = require("../controllers/treeProductController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route("/treeProducts").get(getAllProducts);
router.route("/grower/treeProduct/new").post(isAuthenticatedUser, authorizeRoles("admin", "grower"), createTreeProduct);
router.route("/grower/treeProduct/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin", "grower"), updateTreeProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin", "grower"), deleteTreeProduct);
router.route("/treeProduct/:id").get(getTreeProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);

module.exports = router;