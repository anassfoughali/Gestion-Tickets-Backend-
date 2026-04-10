import axios from "axios";

const AUTH_BASE_URL = process.env.REACT_APP_AUTH_BASE_URL || "http://localhost:8080/api";

const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const loginRequest = (username, password) =>
  authApi.post("/auth/login", { username, password });

export default authApi;