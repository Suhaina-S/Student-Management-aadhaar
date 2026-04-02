const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    transactionID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Success", "Failed", "Pending"], // Optional: restrict to allowed statuses
      trim: true,
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
 