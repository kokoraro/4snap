import Passage from "@passageidentity/passage-node";
import ENV from "../pages/api/config/env";

// this is meant for authenticating with server component.
export default async function serverPassageAuth(context) {
  const passage = new Passage({
    appID: ENV.passageAppId,
    apiKey: ENV.passageApiKey,
    authStrategy: "HEADER",
  });
  try {
    const authToken = context.req.cookies["psg_auth_token"];
    const req = {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    };
    const userID = await passage.authenticateRequest(req);
    if (userID) {
      return { props: { isAuthorized: true } };
    }
  } catch (error) {
    // authentication failed
    console.log(`Authentication failed: ${error.message}`);
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
      props: { isAuthorized: false },
    };
  }
}
