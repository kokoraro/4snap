import { toast } from "react-hot-toast";

const checkServerError = (
  response: any,
  resetState: () => void,
  cancelRefreshing?: () => void
) => {
  if (response?.message === "Network Error") {
    toast.error(response?.message + "\n" + "Try again later.");
    resetState();
    cancelRefreshing && cancelRefreshing();
  }
  if (response?.code === "ECONNABORTED") {
    toast.error("Connection Error" + "\n" + "Try again later.");
    resetState();
    cancelRefreshing && cancelRefreshing();
  }
  if (
    response?.code === "--route/route-not-found" ||
    response?.code === "--api/server-error"
  ) {
    toast.error("Something Went Wrong" + ".." + "Try again later.");
    resetState();
    cancelRefreshing && cancelRefreshing();
  }
  if (response?.code === "--auth/account-notfound") {
    toast.error("Something Went Wrong" + ".." + "Try again later.");
    resetState();
    location.href = "/auth/login";
    localStorage.removeItem("authToken");
  }
};

// check for invalid token
const checkInvalidToken = (
  response: any,
  resetState: () => void,
  cancelRefreshing?: () => void
): void => {
  if (response?.code === "--auth/invalid-token") {
    toast.error("Session Expired. Please log in again.");
    location.href = "/auth/login";
    localStorage.removeItem("authToken");
    resetState();
    cancelRefreshing && cancelRefreshing();
  }
};

// User
export function HandleUserResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (response?.code === "--getUserInfo/success") {
    resetState();
    successfull && successfull();
    localStorage.setItem("@userInfo", JSON.stringify(response?.data));
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Commands
export function HandleCommandResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (response?.code === "--allCommands/success") {
    resetState();
    successfull && successfull();
    returnData(response?.data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}
