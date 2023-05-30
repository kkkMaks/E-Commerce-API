const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [50, "Product name cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      maxlength: [5, "Product price cannot exceed 5 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [500, "Product description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Please provide product image"],
      default: "no-photo.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: {
        values: ["electronics", "accessories", "clothes", "books"],
        message: "Invalid product category",
      },
      default: "electronics",
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
    },
    colors: {
      type: [String],
      default: ["#000"],
      required: [true, "Please provide product colors"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: [true, "Please provide product inventory"],
      default: 1,
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// toJSON: { virtuals: true },
// toObject: { virtuals: true },

// productSchema.virtual("reviews", {
//   ref: "Review",
//   localField: "_id",
//   foreignField: "product_id",
//   justOne: false,
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
