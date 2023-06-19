const serverless = require("serverless-http");
const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} = require("./utils/users");
const port = process.env.PORT || 3000;

/* for importing env variable */
require("dotenv").config();

const server = http.createServer(app);
const io = socketio(server);

/* Run when client connects */
io.on("connection", (socket) => {
	socket.on("joinRoom", ({username, room}) => {
		const user = userJoin(socket.id, username, room);
		console.log(user);
		socket.join(user.room);

		/* to single client that just connected(current user) */
		socket.emit(
			"message",
			formatMessage(process.env.BOT_NAME, "Welcome to chatCord!")
		);

		/* to everyone in the groupchat except the joined client */
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(
					process.env.BOT_NAME,
					`${user.username} has joined the chat`
				)
			);

		/* Send room and room users info */
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		console.log("user", user);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(
					process.env.BOT_NAME,
					`${user.username} has left the chat`
				)
			);

			/* Send room and room users info */
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}

		
	});

	socket.on("textMessage", (msg) => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit("message", formatMessage(user.username, msg));
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
