import express from "express";
const { sendEmail } = require("../controllers/mailController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/", sendEmail);

module.exports = router;
