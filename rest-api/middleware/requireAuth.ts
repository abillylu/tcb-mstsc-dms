const jwt = require("jsonwebtoken");
import prisma from "../client";

const requireAuth = async (req: any, res: any, next: any) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(401).json({ error: "Authorization token required" });
	}

	const token = authorization.split(" ")[1];

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET);

		req.user = await prisma.users_table.findUnique({
			where: {
				id,
			},
		});
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ error: "Unauthorized Request" });
	}
};

module.exports = requireAuth;
