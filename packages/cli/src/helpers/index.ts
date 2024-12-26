export const sleep = async (sec: number) => {
  return new Promise((res) => setTimeout(res, sec * 1000));
};
