import express from "express";
import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import meetHandler from "../sockets/MeetHandler.js";

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: "*",
});

meetHandler(io.of("/meet"));

server.listen(process.env.PORT, () =>
  console.log(`server is up and running at PORT : ${process.env.PORT}`)
);
