// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const Order = new Schema({
  orderNumber: String,
  rep: String,
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Orders", Order);