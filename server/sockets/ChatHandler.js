const chatHandler = (io) => {
  io.on("connection", (socket) => {
    //send message
    socket.on("send_message", ({ fromSocketId, msg }) => {
      socket.broadcast.emit("new message", { fromSocketId, msg });
    });
    socket.on("send_message_private", (fromSocketId, ToSocketId, msg) => {
      socket.to(ToSocketId).emit("new message private", { fromSocketId, msg });
    });
  });
};
export default chatHandler;
