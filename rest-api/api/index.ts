require("dotenv").config();

const express = require("express");

const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

const userRoutes = require("../routes/users");
const containerRoutes = require("../routes/containers");
const customerRoutes = require("../routes/customers");
const soaRoutes = require("../routes/soas");
const bsRoutes = require("../routes/bss");
const mailRoutes = require("../routes/mail");

app.use("/api/users", userRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/containers", containerRoutes);

app.use("/api/soas", soaRoutes);

app.use("/api/bss", bsRoutes);

app.use("/api/mail", mailRoutes);

app.get("/", (req: any, res: any) => {
	res.status(200).json({ hello: "world" });
});

app.get("/", (req: any, res: any) => {
	res.status(200).json({ hello: "world" });
});

app.listen(port || 8080, () => {
	console.log("Listening on port", port);
});

module.exports = app;
