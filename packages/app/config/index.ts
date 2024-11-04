import ENV from "../pages/api/config/env";

// export const BACKEND_BASE_URL = `http://localhost:3000/api`;
export const BACKEND_BASE_URL = `${ENV.clientUrl}/api`;
