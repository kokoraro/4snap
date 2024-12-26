import axios from "axios";
import storage from "../config/index.js";
const baseURL = `http://localhost:3000/api`;
const $http = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "x-qwik-token": storage.get("@authToken"),
    },
    withCredentials: true,
});
export default $http;
