const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/order");

const {
  authenticatedUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get([authenticatedUser, authorizePermissions("admin")], getAllOrders)
  .post(authenticatedUser, createOrder);

router.route("/showAllMyOrders").get(authenticatedUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticatedUser, getSingleOrder)
  .patch(authenticatedUser, updateOrder);

module.exports = router;
