import prisma from "../client";
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createUser = async (req: any, res: any) => {
	let { email, password, name, user_type, signature } = req.body;

	let exists = await prisma.users_table.count({
		where: {
			email,
		},
	});

	if (exists === 1) {
		res.status(400).json({ error: "Email already in use" });
	} else {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const createUser = await prisma.users_table.create({
			data: {
				email,
				password: hash,
				name,
				user_type,
				signature,
			},
		});

		res.status(200).json({ message: "User successfully signed up", createUser });
	}
};

const loginUser = async (req: any, res: any) => {
	let { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ error: "All fields must be filled" });
	} else {
		const user = await prisma.users_table.findUnique({
			where: {
				email: email,
			},
		});

		if (user) {
			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				res.status(400).json({ error: "Incorrect email or password" });
			} else {
				const token = createToken(user?.id);

				res.status(200).json({
					token,
					id: user.id,
					email: user.email,
					name: user.name,
					type: user.user_type,
					signature: user.signature,
				});
			}
		} else {
			res.status(400).json({ error: "Incorrect email or password" });
		}
	}
};

const signupUser = async (req: any, res: any) => {
	let { email, password, name, signature } = req.body;

	const user_type = "USER";

	if (!email || !password) {
		res.status(400).json({ error: "All fields must be filled" });
	} else {
		if (validator.isEmail(email)) {
			let exists = await prisma.users_table.count({
				where: {
					email,
				},
			});

			if (exists === 1) {
				res.status(400).json({ error: "Email already in use" });
			} else {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(password, salt);

				try {
					const user = await prisma.users_table.create({
						data: {
							email,
							password: hash,
							name,
							user_type,
							signature,
						},
					});

					const token = createToken(user.id);

					res.status(200).json({
						token,
						id: user.id,
						email: user.email,
						name: user.name,
						type: user.user_type,
						signature: user.signature,
					});
				} catch (error) {
					res.status(400).json({ error: "Please fill up all the fields necessary" });
				}
			}
		} else {
			res.status(400).json({ error: "Invalid Email" });
		}
	}
};

module.exports = { createUser, loginUser, signupUser };
