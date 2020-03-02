import io from "socket.io-client";
// socket.io在(readyState == 1)的時候, 會阻塞buffer
io._original_send_func = io.send;
io.send = function(data) {
	if (this.readyState == 1) this._original_send_func(data);
}.bind(io);

const socket = io("ws://192.168.100.5:4000");

export default socket;
