import $http from "./axios.js";
export const authenticate = async (data) => {
    try {
        const res = await $http.post(`/auth/cliAuth`, data);
        return res?.data ?? res?.response?.data;
    }
    catch (e) {
        return e.response.data ?? { message: e.message };
    }
};
export const createCmds = async (data) => {
    try {
        const res = await $http.post(`/command/cli/create`, data);
        return res?.data ?? res?.response?.data;
    }
    catch (e) {
        return e.response.data ?? { message: e.message };
    }
};
export const getAllCmds = async (data) => {
    try {
        const res = await $http.get(`/command/cli/get`, data);
        return res?.data ?? res?.response?.data;
    }
    catch (e) {
        return e.response.data ?? { message: e.message };
    }
};
export const deleteCmd = async (data) => {
    try {
        const res = await $http.post(`/command/cli/delete`, data);
        return res?.data ?? res?.response?.data;
    }
    catch (e) {
        return e.response.data ?? { message: e.message };
    }
};
