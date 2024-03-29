const express = require("express");
const _ = require("lodash");

const router = express.Router();
const { validateCustomer, Customer } = require("../models/customer");

router
  .route("/")
  .get(async (req, res) => {
    const customers = await Customer.find()
      .sort()
      .populate("author", "name bio"); //only name bio will be retrieved
    res.send(customers);
  })
  .post(async (req, res) => {
    const { error } = validateCustomer(req);
    if (error) return res.send(error.details[0].message);

    try {
      const customer = new Customer(req.body);
      result = await customer.save();
      res.send(result);
    } catch (error) {
      res.send(error.message);
    }
  });
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req);
  if (error) return res.send(error.details[0].message);
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params._id,
      _.pick(req.body, ["name", "phone", "isGold", "author"]),
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
