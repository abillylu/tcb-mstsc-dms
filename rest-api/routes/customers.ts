import express from "express";
const { createCustomer, getCustomers } = require("../controllers/customerController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCustomers);

router.post("/", createCustomer);

module.exports = router;
