const express = require("express");
const router = express.Router();
const { validateCustomer, Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort();
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req);
  if (error) return res.send(error.details[0].message);

  try {
    const customer = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    });
    result = await customer.save();
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/:_id", async (req, res) => {
  const { error } = validateCustomer(req);
  if (error) return res.send(error.details[0].message);
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params._id,
      {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
      },
      { new: true }
    );
    res.send(customer);
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/:_id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params._id);
    res.send(customer);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
