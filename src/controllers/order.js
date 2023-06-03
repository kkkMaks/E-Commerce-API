const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const Order = require("../models/Order");

const { BadRequestError, NotFoundError } = require("../errors/index");

const { checkPermissions } = require("../utils");

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ amount: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: orderId },
  } = req;

  const order = await Order.findOne({ _id: orderId });

  checkPermissions(req.user, order.user);
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;

  const orders = await Order.find({ user: userId });

  res.status(StatusCodes.OK).json({ amount: orders.length, orders });
};

const createOrder = async (req, res) => {
  const { items: orderItems } = req.body;
  const { userId } = req.user;

  if (!orderItems || orderItems.length < 1) {
    throw new BadRequestError("No order items");
  }

  const orderItemsIds = orderItems.map((order) => order.product);
  const products = await Product.find({ _id: { $in: orderItemsIds } }).select(
    "_id price inventory"
  );

  const validateItem = (orderItem, product) => {
    const {
      price: itemPriceFromUser,
      amount: itemAmountFromUser,
      name,
    } = orderItem;
    const { price: itemPriceFromDB, inventory: itemInventoryFromDB } = product;

    if (itemPriceFromUser !== itemPriceFromDB) {
      throw new BadRequestError(
        `Invalid price for item ${name}, expected ${itemPriceFromDB}, got ${itemPriceFromUser}`
      );
    }
    if (itemAmountFromUser > itemInventoryFromDB) {
      throw new BadRequestError(
        `Not enough stock for item ${name}, expected ${itemInventoryFromDB}, got ${itemAmountFromUser}`
      );
    }
  };

  products.forEach((product, index) => {
    validateItem(orderItems[index], product);
  });

  const totalPriceWithoutTax = orderItems.reduce(
    (acc, item) => acc + item.price * item.amount,
    0
  );
  const tax = totalPriceWithoutTax * 0.15;
  const shippingFee = totalPriceWithoutTax > 20000 ? 0 : 500;
  const totalPrice = totalPriceWithoutTax + tax + shippingFee;
  console.log(typeof tax, typeof shippingFee, typeof totalPrice);
  console.log(totalPriceWithoutTax);
  console.log(tax, shippingFee, totalPrice);

  const order = await Order.create({
    tax,
    shippingFee,
    subtotal: totalPrice,
    orderItems,
    status: "pending",
    user: userId,
    clientSecret: "clientSecret",
    paymentIntentId: "paymentIntentId",
  });
  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req, res) => {
  const {
    params: { id: orderId },
    body: { paymentIntentId, status },
  } = req;

  if (status && status === "paid") {
    throw new BadRequestError("Cannot manually update status to paid");
  }
  if (!paymentIntentId) throw new BadRequestError("No payment intent id");

  const order = await Order.findOne({ _id: orderId });

  checkPermissions(req.user, order.user);

  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`);
  }

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
