import express from "express";

const { createUser, signupUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/", createUser);

router.post("/login", loginUser);

router.post("/signup", signupUser);

module.exports = router;
