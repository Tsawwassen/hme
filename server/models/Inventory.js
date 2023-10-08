// Require Mongoose
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Define a schema
const InventorySchema = new Schema({
  part_number: String,
  quantity: Number,
},
{
    collection: 'inventory'
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model('Inventory', InventorySchema);
//const Order = model('Order', OrderSchema);
//export default Order;