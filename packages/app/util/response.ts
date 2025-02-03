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
    location.href = "/auth";
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
    location.href = "/auth";
    localStorage.removeItem("psg_auth_token");
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
    returnData(response?.data);
    return;
  }

  if (
    ["--create/user-exists", "--create/invalid-field", ,].includes(
      response?.code
    )
  ) {
    resetState();
    toast.error(response?.message);
    return;
  }

  if (response?.code === "--create/success") {
    resetState();
    toast.success(response?.message);
    successfull && successfull();
  }

  if (response?.code === "--getAuthToken/success") {
    resetState();
    returnData(response?.data);
  }

  if (response?.code === "--rotateAuthToken/success") {
    resetState();
    returnData(response?.data);
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
  if (
    [
      "--createInAppCommand/invalid-fields",
      "--createInAppCommand/name-exists",
      "--deleteCommand/name-exists",
      "--deleteCommand/invalid-fields",
    ].includes(response?.code)
  ) {
    resetState();
    toast.error(response?.message);
    return;
  }

  if (
    ["--allCommands/success", "--deleteCommand/success"].includes(
      response?.code
    )
  ) {
    resetState();
    successfull && successfull();
    returnData(response?.data);
    return;
  }

  if (response?.code === "--sharedCmd/success") {
    resetState();
    successfull && successfull();
    returnData(response?.data);
    return;
  }

  if (response?.code === "--createInAppCommand/success") {
    toast.success(response?.message);
    resetState();
    successfull && successfull();
    return;
  }
  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}
