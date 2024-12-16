import $http from "./axios.js";

export const authenticate = async (data: any) => {
  try {
    const res = await $http.post(`/auth/cliAuth`, data);
    return res?.data ?? (res as any)?.response?.data;
  } catch (e: any) {
    return e.response.data ?? { message: e.message };
  }
};
