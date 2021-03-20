const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: Number, required: true },
      country: { type: String, required: true },
    },
    total: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
orderSchema.plugin(require("./plugins/isDeletedFalse"));

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
