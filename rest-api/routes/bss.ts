import express from "express";
const { getBSs, createBS, downloadBS } = require("../controllers/bsController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getBSs);

router.post("/", createBS);

router.post("/download", downloadBS);

module.exports = router;
