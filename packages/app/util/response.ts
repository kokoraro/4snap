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

// login response handler
export function HandleAuthenticationResponse(
  response: any,
  resetState: () => void,
  successfulAuthentication: () => void
) {
  if (response?.code === "--auth/invalid-credentials") {
    toast.error("Invalid credentials");
    resetState();
    console.log("hey");
    return;
  }
  if (response?.code === "--auth/user-notfound") {
    toast.error("User not found");
    resetState();
    return;
  }
  if (response?.code === "--auth/invalid-fields") {
    toast.error(response?.message);
    resetState();
    return;
  }
  if (response?.code === "--auth/password-incorrect") {
    toast.error("Password is incorrect.");
    resetState();
    return;
  }
  if (response?.code === "--auth/verify-email") {
    toast.success(response?.message, {
      duration: 3000,
    });
    resetState();
    successfulAuthentication();
    return;
  }
  if (response?.code === "--auth/account-verified") {
    toast.success(`Account verified, check Inbox..\n\n ${response?.message}`, {
      duration: 3000,
    });
    resetState();
    successfulAuthentication();
    return;
  }

  // resending temporary password
  if (response?.code === "--resendTempPwd/password-expired") {
    toast.error(`${response?.message}`, {
      duration: 3000,
    });
    resetState();
    // location && location.reload();
    return;
  }
  if (response?.code === "--resendTempPwd/user-notFound") {
    toast.error(`${response?.message}`, {
      duration: 3000,
    });
    resetState();
    // location && location.reload();
    return;
  }
  if (response?.code === "--resendTempPwd/success") {
    toast.success(`Temporary password sent..`, {
      duration: 3000,
    });
    resetState();
    return;
  }
  // end of resend temp password.

  if (response?.code === "--auth/loggedIn") {
    resetState();
    const { email, id, image, token, username, fullname } = response?.data;
    const userData = {
      id,
      image,
      email,
      username,
      fullname,
    };
    localStorage.setItem("authToken", JSON.stringify(token));
    localStorage.setItem("userData", JSON.stringify(userData));
    successfulAuthentication();
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// handle password reset
export function HandlePasswordResetResponse(
  response: any,
  resetState: () => void,
  success: (data?: any) => void
) {
  if (
    [
      "--verifyPasswordReset/invalid-field",
      "--verifyPasswordReset/invalid-token",
    ].includes(response?.code)
  ) {
    resetState();
    success({ code: "INVALID_LINK" });
    return;
  }
  if (
    [
      "--passwordReset/user-notfound",
      "--verifyPasswordReset/user-notfound",
    ].includes(response?.code)
  ) {
    resetState();
    success({ code: "USER_NOT_FOUND" });
    return;
  }
  if (response?.code === "--verifyPasswordReset/verified") {
    resetState();
    success({ code: "VERIFIED" });
    return;
  }
  if (
    [
      "--sendResetLink/invalid-field",
      "--sendResetLink/user-notfound",
      "--passwordReset/invalid-fields",
    ].includes(response?.code)
  ) {
    toast.error(response?.message);
    resetState();
    return;
  }
  if (["--passwordReset/invalid-token"].includes(response?.code)) {
    resetState();
    toast.error("Password reset link expired.");
    return;
  }
  if (response?.code === "--sendResetLink/success") {
    resetState();
    success({ code: "RESET_LINK_SENT" });
    return;
  }

  if (response?.code === "--passwordReset/successfull") {
    toast.success("Password reset successfully.");
    resetState();
    localStorage.removeItem("reset_password_email");
    location.href = "/auth/login";
    success();
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// thread response handler
export function HandleThreadResponse(
  response: any,
  resetState: () => void,
  successfull: () => void
) {
  if (response?.code === "--createThread/invalid-fields") {
    toast.error("Some thread input are empty");
    resetState();
    return;
  }
  if (response?.code === "--createThread/token-missing") {
    toast.error(response?.message);
    resetState();
    return;
  }
  if (response?.code === "--createThread/failed-replying-thread") {
    toast.error("Failed adding child thread content.");
    resetState();
    return;
  }
  if (response?.code === "--createThread/failed-creating-thread") {
    toast.error(`Failed creating thread. try again later.`);
    resetState();
    return;
  }
  if (response?.code === "--createThread/success") {
    toast.success(`Thread created successfully`, {
      duration: 3000,
    });
    resetState();
    successfull();
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

export function HandleBookmarkResponse(
  response: any,
  resetState: () => void,
  successfull: () => void,
  returnData: (data) => any
) {
  if (response?.code === "--bookmarkData/invalid-fields") {
    toast.error(response.message);
    resetState();
    return;
  }
  if (response?.code === "--bookmarkData/bookmark-exists") {
    toast.error(`You already have this bookmarked.`);
    resetState();
    return;
  }
  if (response?.code === "--bookmarkData/token-missing") {
    toast.error(response?.message);
    resetState();
    return;
  }
  if (response?.code === "--bookmarkData/successfull") {
    toast.success(`Saved to bookmark.`);
    resetState();
    return;
  }

  if (response?.code === "--bookmarks/all-bookmarks") {
    resetState();
    successfull();
    returnData(response?.data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

export function HandleNotifierResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (response?.code === "--createVariant/invalid-fields") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--createVariant/invalid-type") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--createVariant/name-exists") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--deleteVariant/invalid-ID") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--deleteVariant/unauthorised") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--createVariant/success") {
    toast.success("Variant created successfully.");
    resetState();
    successfull();
    return;
  }

  if (response?.code === "--deleteVariant/success") {
    toast.success("variant deleted successfully.");
    resetState();
    returnData(response?.data);
    return;
  }

  if (response?.code === "--allVariants/success") {
    resetState();
    returnData(response?.data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Settings
export function HandleSettingsResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (response?.code === "--settings/invalid-field") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--settings/token-updated") {
    resetState();
    toast.success(`Token updated successfully.`);
    successfull && successfull();
    return;
  }

  if (response?.code === "--settings/token-added") {
    resetState();
    successfull && successfull();
    toast.success(`Token added successfully.`);
    return;
  }

  if (response?.code === "--settings/token-fetched") {
    resetState();
    successfull && successfull();
    const data = response?.data;
    returnData(data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Page Builder
export function HandlePageBuilderResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (
    [
      "--pageBuilder/invalid-fields",
      "--deleteSite/invalid-fields",
      "--updateSite/invalid-fields",
      "--refetchSiteData/invalid-fields",
    ].includes(response?.code)
  ) {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/slug-exists") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--refetchSiteData/site-not-found") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--refetchSiteData/something-went-wrong") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/invalid-notion-page") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/verify-notion-page") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/invalid-notion-token") {
    toast.error(response?.message);
    resetState();
    return;
  }
  if (response?.code === "--pageBuilder/invalid-notion-url") {
    toast.error(`Notion page isn't linked to integration.`);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/server-error") {
    toast.error(
      `Something went wrong verifying notion page. Please try again later.`
    );
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/notionPage-in-use") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/missing-colums") {
    toast.error(response?.message);
    resetState();
    const data = response?.data;
    returnData(data?.fields);
    return;
  }

  if (response?.code === "--updateSite/invalid-slug") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--deleteSite/failed") {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageBuilder/notion-verified") {
    toast.success(response?.message);
    resetState();
    successfull && successfull();
    const data = response?.data;
    returnData(Object.keys(data?.properties));
    return;
  }

  if (
    [
      "--pageBuilder/success",
      "--updateSite/success",
      "--deleteSite/success",
      "--refetchSiteData/siteData-updated",
    ].includes(response?.code)
  ) {
    toast.success(response?.message);
    resetState();
    successfull && successfull();
    return;
  }

  if (response?.code === "--pageBuilder/sites-fetched") {
    const data = response?.data;
    const allSites = data?.sites;
    returnData(allSites);
    resetState();
    successfull && successfull();
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Dashboard
export function HandleDashboardResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (
    ["--pageViews/slug-notfound", "--pageViews/slug-notfound"].includes(
      response?.code
    )
  ) {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--pageViews/success") {
    resetState();
    successfull && successfull();
    const data = response?.data;
    returnData(data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Friendcord
export function HandleFriendcordResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (
    [
      "--suggestedFollowers/something-went-wrong",
      "--userMatching/failed",
      "--userMatching/match-error",
    ].includes(response?.code)
  ) {
    toast.error(response?.message);
    resetState();
    return;
  }

  if (response?.code === "--suggestedFollowers/success") {
    resetState();
    successfull && successfull();
    const data = response?.data;
    returnData(data);
    return;
  }

  if (response?.code === "--userMatching/success") {
    toast.success(response?.message);
    resetState();
    successfull && successfull();
    const data = response?.data;
    returnData(data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}

// Meet
export function HandleMeetResponse(
  response: any,
  resetState: () => void,
  returnData: (data) => any,
  successfull?: () => void | any
) {
  if (
    ["--meeting/notfound", "--meeting/field-empty"].includes(response?.code)
  ) {
    toast.error(response?.message);
    returnData({ code: "MEETING_NOTFOUND" });
    resetState();
    return;
  }

  // all created meeting.
  if (response?.code === "--meeting/fetched") {
    resetState();
    successfull && successfull();
    returnData(response?.data);
    return;
  }

  if (response?.code === "--meeting/success") {
    toast.success(response?.message);
    resetState();
    successfull && successfull();
    returnData(response?.data);
    return;
  }

  // meet by slug
  if (response?.code === "--meeting/fetched-successfully") {
    resetState();
    returnData(response?.data);
    return;
  }

  // api server error
  checkServerError(response, resetState);
  checkInvalidToken(response, resetState);
}
