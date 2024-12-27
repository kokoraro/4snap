import { randomUUID } from "crypto";
import $http from "./axios";
import { genRandNum } from "../util";

export const createInAppUser = async (data: any) => {
  try {
    const res = await $http.post(`/user/create`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const getUserInfo = async () => {
  try {
    const res = await $http.get(`/user/getInfo?t=${genRandNum()}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

// Commands

// invoked only from the web app.
export const createInAppCommands = async (data: any) => {
  try {
    const res = await $http.post(`/command/inApp/create`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const deleteInAppCommands = async (data: any) => {
  try {
    const res = await $http.post(`/command/inApp/delete`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const retrieveInAppCommands = async () => {
  try {
    const res = await $http.get(`/command/inApp/get?id=${genRandNum()}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

// invoked only from cli
export const createCliCommands = async (data: any) => {
  try {
    const res = await $http.post(`/command/inApp/create`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const retrieveCliCommands = async () => {
  try {
    const res = await $http.get(`/command/cli/get?id=${genRandNum()}`);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};

export const deleteCliCommands = async (data: any) => {
  try {
    const res = await $http.post(`/command/cli/delete`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};
