const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users")
const socket = io();

/* Get username and room */
const {username, room} = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

/* Join room */
socket.emit("joinRoom", {username, room});

socket.on("roomUsers", ({room, users}) => {
	outputRoom(room);
	outputUsers(users);
});

/* Message from Server */
socket.on("message", (message) => {
	console.log(message);

	outputMessage(message);

	/* scroll down */
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

/* Message submit */
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	/* Get message value */
	const msg = e.target.elements.msg.value;

	/* Send message to Server */
	socket.emit("textMessage", msg);

	e.target.elements.msg.value = "";
	e.target.elements.msg.focus();
});

function outputMessage(message) {
	const div = document.createElement("div");
	div.classList.add("message");

	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
	<p class="text">
		${message.text}
	</p>`;

	document.querySelector(".chat-messages").appendChild(div);
}

function outputRoom(room) {
	roomName.innerText = room;
}

function outputUsers(users) {
	userList.innerHTML = `
	${users.map(user => `<li>${user.username}</li>`).join('')}
	`;
}
