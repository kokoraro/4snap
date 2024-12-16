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
