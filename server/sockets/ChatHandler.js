const chatHandler = (io) => {
  io.on("connection", (socket) => {
    //send message
    socket.on("send_message", ({ socketId, msg }) => {
      socket.broadcast.emit("new message", { msg });
    });
  });
};
export default chatHandler;
