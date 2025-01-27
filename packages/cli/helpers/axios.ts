import axios, { AxiosError, AxiosInstance } from "axios";
import storage from "../config/index.js";

const baseURL = `https://4snapp.vercel.app/api`;
// const baseURL = `http://localhost:3000/api`;

const $http: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-4snap-token": storage.get("@authToken") as string,
  },
  withCredentials: true,
});

export default $http;
