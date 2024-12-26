export const sleep = async (sec) => {
    return new Promise((res) => setTimeout(res, sec * 1000));
};
