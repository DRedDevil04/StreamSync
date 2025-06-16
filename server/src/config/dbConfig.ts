import mongoose from "mongoose";
import config from "./config";

mongoose
  .connect(
    `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
    {}
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
