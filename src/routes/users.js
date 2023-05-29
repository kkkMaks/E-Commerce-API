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
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router
  .route("/")
  .get(
    [authenticatedUser, authorizePermissions("admin", "owner")],
    getAllUsers
  );
router.route("/showMe").get(authenticatedUser, showCurrentUser);
router.route("/updateUser").patch(authenticatedUser, updateUser);
router
  .route("/updateUserPassword")
  .patch(authenticatedUser, updateUserPassword);
router
  .route("/:id")
  .get(
    [authenticatedUser, authorizePermissions("admin", "user")],
    getSingleUser
  );

module.exports = router;
