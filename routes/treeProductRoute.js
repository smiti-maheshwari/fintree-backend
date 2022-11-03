const express = require("express");
const { getAllProducts, createTreeProduct, updateTreeProduct, deleteTreeProduct, getTreeProductDetails } = require("../controllers/treeProductController");

const router = express.Router();

router.route("/treeProducts").get(getAllProducts);
router.route("/treeProduct/new").post(createTreeProduct);
router.route("/treeProduct/:id")
    .put(updateTreeProduct)
    .delete(deleteTreeProduct)
    .get(getTreeProductDetails);

module.exports = router;