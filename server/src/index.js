import express from "express";
import "dotenv/config";
const app = express();

app.listen(process.env.PORT, () =>
  console.log(`server is up and running at PORT : ${process.env.PORT}`)
);
