const serverless = require("serverless-http");
const express = require("express");
const app = express();
const port = 3000; 

app.get('/hello', (req, res) => res.send('hello world #1'));

/* app.listen(port, () => {
	console.log("App running on port: ", port);
});
 */
module.exports.handler = serverless(app);
