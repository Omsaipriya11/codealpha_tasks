const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// place order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;