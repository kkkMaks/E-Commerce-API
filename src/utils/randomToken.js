const crypto = require("crypto");

const generateRandomToken = () => crypto.randomBytes(44).toString("hex");

module.exports = generateRandomToken;
