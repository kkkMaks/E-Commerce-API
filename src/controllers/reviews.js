const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { checkPermissions } = require("../utils");

const Review = require("../models/Review");
const Product = require("../models/Product");

const createReview = async (req, res) => {
  const { product } = req.body;

  const isValidProduct = await Product.findOne({ _id: product });
  if (!isValidProduct) {
    throw new NotFoundError(`No product with id ${product}`);
  }

  const alreadySubmitted = await Review.findOne({
    product,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new BadRequestError("You have already submitted a review");
  }

  req.body.user = req.user.userId;

  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(StatusCodes.OK).json({ amount: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById({ _id: id })
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  if (!review) {
    throw new NotFoundError(`No review with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById({ _id: id });

  if (!review) {
    throw new NotFoundError(`No review with id ${id}`);
  }

  checkPermissions(req.user, review.user._id);

  Object.assign(review, req.body);
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById({ _id: id });

  if (!review) {
    throw new NotFoundError(`No review with id ${id}`);
  }

  checkPermissions(req.user, review.user._id);

  await review.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  res.status(StatusCodes.OK).json({ amount: reviews.length, reviews });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
