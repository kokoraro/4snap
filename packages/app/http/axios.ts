import Router from "next/router";
import axios, { AxiosError, AxiosInstance } from "axios";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { BACKEND_BASE_URL } from "../config";

const baseURL = BACKEND_BASE_URL;

const $http: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${
      typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("authToken"))
    }`,
  },
  withCredentials: true,
});

$http.interceptors.request.use((config: any) => {
  // If auth-token is available, add it to the Axios API header
  if (hasCookie("auth-token", {})) {
    config.headers["Authorization"] = `Bearer ${getCookie("auth-token", {})}`;
  }

  return config;
});

export default $http;
