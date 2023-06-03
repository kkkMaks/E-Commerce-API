const express = require("express");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const {
  authenticatedUser,
  authorizePermissions,
} = require("../middleware/authentication");

const { getSingleProductReviews } = require("../controllers/reviews");

const router = express.Router();

router
  .route("/")
  .get(authenticatedUser, getAllProducts)
  .post([authenticatedUser, authorizePermissions("admin")], createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticatedUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticatedUser, authorizePermissions("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
