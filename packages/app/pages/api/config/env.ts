// const LOCAL_DB_CONN = "mongodb://localhost:27020/prospark-db";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.DATABASE_URL,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://4snapp.vercel.app",
  passageAppId: process.env.PASSAGE_APP_ID,
  passageApiKey: process.env.PASSAGE_API_KEY,
};

export default ENV;
