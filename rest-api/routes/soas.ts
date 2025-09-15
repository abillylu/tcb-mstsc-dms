import express from "express";
const { createSOA, editSOA, getSOAs, downloadSOA } = require("../controllers/soaController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getSOAs);

router.post("/download", downloadSOA);

router.post("/", createSOA);

router.post("/edit", editSOA);

module.exports = router;
