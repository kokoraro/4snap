import axios, { AxiosError, AxiosInstance } from "axios";
import storage from "../config/index.js";

const baseURL = `http://localhost:3000/api`;
// const baseURL = `https://qwik.vercel.app/api`;

const $http: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "x-qwik-token": storage.get("@authToken") as string,
  },
  withCredentials: true,
});

export default $http;
