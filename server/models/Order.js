// Require Mongoose
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Define a schema
//const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  orderNumber: String,
  rep: String,
  comment: String,
  weeksOld: Number,
},
{
    collection: 'orders'
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Order', OrderSchema);
//const Order = model('Order', OrderSchema);
//export default Order;