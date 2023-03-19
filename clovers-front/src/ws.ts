import { WS_ENDPOINT } from "./config";

export const ws = new WebSocket(WS_ENDPOINT);

ws.addEventListener("open", (_event) => {
  console.log("WebSocket connection opened");
});

ws.addEventListener("message", (event) => {
  console.log("WebSocket message from server ", event.data);
});

ws.addEventListener("error", (event) => {
  console.log("WebSocket error from server ", event);
});

ws.addEventListener("close", (_event) => {
  console.log("WebSocket connection closed");
});
