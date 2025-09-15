import express from "express";
const { createContainer, getContainers } = require("../controllers/containerController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getContainers);

router.post("/", createContainer);

module.exports = router;
