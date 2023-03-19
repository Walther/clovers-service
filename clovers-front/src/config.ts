export const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND;

const url = new URL(REACT_APP_BACKEND || "http://localhost:8080");
export const WS_ENDPOINT = `ws://${url.host}/ws`;
