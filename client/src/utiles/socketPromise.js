const socketPromise = (socket, eventName, data) => {
  return new Promise((resolve, reject) => {
    socket.emit(eventName, data, (res) => {
      if (res?.error) reject(res.error);
      else resolve(res);
    });
  });
};
export default socketPromise;
