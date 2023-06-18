const serverless = require("serverless-http");
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	return res.status(200).json({
		message: "success",
		data: "hello world"
	})
});

/* app.listen(port, () => {
	console.log("App running on port: ", port);
});
 */
module.exports.handler = serverless(app);
