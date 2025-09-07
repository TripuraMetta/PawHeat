const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  type: { type: String, required: true },  // "money", "food", "fabric"
  amount: { type: Number },                // For money donations
  itemType: { type: String },              // For food/fabric type
  quantity: { type: Number },              // For food/fabric quantity
  pickupRequest: { type: Boolean, default: false },
  address: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);
