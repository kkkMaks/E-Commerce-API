const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/users");

const {
  authenticatedUser,
  authorizeAdminPermissions,
} = require("../middleware/authentication");

const router = express.Router();

router
  .route("/")
  .get(authenticatedUser, authorizeAdminPermissions, getAllUsers);
router.route("/showMe").get(authenticatedUser, showCurrentUser);
router.route("/updateUser").patch(authenticatedUser, updateUser);
router
  .route("/updateUserPassword")
  .patch(authenticatedUser, updateUserPassword);
router
  .route("/:id")
  .get(authenticatedUser, authorizeAdminPermissions, getSingleUser);

module.exports = router;
