const path = require("path");

const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const Product = require("../models/Product");
const { NotFoundError, BadRequestError } = require("../errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ amount: products.length, products });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById({ _id: id });

  if (!product) {
    throw new NotFoundError(`No product with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`No product with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById({ _id: id });

  if (!product) {
    throw new NotFoundError(`No product with id ${id}`);
  }
  await product.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};

const uploadProductImage = async (req, res) => {
  const productImage = req.file;

  if (!productImage) {
    throw new BadRequestError("Please upload an image");
  }

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image file");
  }

  if (productImage.size > process.env.MAX_FILE_UPLOAD) {
    throw new BadRequestError(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    );
  }

  const imagePath = path.join(productImage.destination, productImage.filename);

  const result = await cloudinary.uploader.upload(imagePath, {
    folder: "e-commerce/products",
    use_filename: true,
  });
  const imageSecureUrl = result.secure_url;

  fs.unlink(imagePath, (err) => {
    if (err) throw err;
    console.log("Image deleted");
  });

  res.status(StatusCodes.OK).json({ image: imageSecureUrl });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
