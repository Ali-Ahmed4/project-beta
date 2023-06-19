const serverless = require("serverless-http");
const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const port = 3000 || process.env.PORT;

/* for importing env variable */
require("dotenv").config();

const server = http.createServer(app);
const io = socketio(server);

/* Run when client connects */
io.on("connection", (socket) => {


	/* to single client that just connected(current user) */
	socket.emit("message", "Welcome to chatCord!");

	/* to everyone in the groupchat except the joined client */
	socket.broadcast.emit("message", "A user has joined the chat");

	socket.on("disconnect", () => {
		io.emit("message", "A user has left the chat");
	});
});

/* set static folder */
app.use(express.static(path.join(__dirname, "public")));

/* Api route */
app.get("/hello", (req, res) => res.send("hello world #1"));

/* Connection to server */
if (process.env.ENV != "local") {
	module.exports.handler = serverless(app);
} else {
	server.listen(port, () => {
		console.log("App running on port: ", port);
	});
}
