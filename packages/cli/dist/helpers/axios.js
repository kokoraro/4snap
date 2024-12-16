import axios from "axios";
const baseURL = `http://localhost:3000/api`;
const $http = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
    withCredentials: true,
});
export default $http;
