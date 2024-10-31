
const LOCAL_DB_CONN = "mongodb://localhost:27020/prospark-db";

const ENV = {
  jwtSecret: process.env.JWT_SECRET,
  mongoUrl: process.env.NODE_ENV === "development" ? LOCAL_DB_CONN : process.env.MONGODB,
  clientUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://paycode.co",
};

export default ENV;
