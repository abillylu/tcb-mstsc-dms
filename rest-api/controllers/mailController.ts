const sendEmail = async (req: any, res: any) => {
	const { body, sender } = req.body;

	res.status(200).json({ body });
};

module.exports = { sendEmail };
