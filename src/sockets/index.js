// import WebSocket from "ws";

const wsuri = "ws://192.168.100.5:4000/";
const wsClient = new WebSocket(wsuri);

// 發送
wsClient.onopen = () => {
  const msg = {
    type: "message",
    text: "wow",
    id: "123",
    date: Date.now()
  };
  wsClient.send(JSON.stringify(msg));
};

// 接收
wsClient.onmessage = function() {
  // console.log(event.data);
};

export default wsClient;
