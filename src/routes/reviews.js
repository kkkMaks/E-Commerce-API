const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const { authenticatedUser } = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

router.route("/").get(getAllReviews).post(authenticatedUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticatedUser, updateReview)
  .delete(authenticatedUser, deleteReview);

module.exports = router;
