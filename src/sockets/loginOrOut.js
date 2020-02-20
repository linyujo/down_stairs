import wsClient from "./index";

export const loginEmitter = () => {
  wsClient.emit("message", "hello server");
};
