import { Store } from "./store.js";

const meetHandler = (io) => {
  io.on("connection", (socket) => {
    //is meetId valid
    socket.on("is_valid_meetId", ({ meetId }, callback) => {
      for (const key of Store.rooms.keys()) {
        if (key === meetId) {
          callback({ isValid: false });
          break;
        }
      }
      callback({ isValid: true, meetId });
    });
    //create new meet
    socket.on("new_meet", ({ name, email, meetId }, callback) => {});

    //join a meet by id
    socket.on("join_meet", ({ name, email, meetId }, callback) => {});

    //rtp capabilities
    socket.on("rtp_capabilities", ({ meetId }, callback) => {});

    //create transport
    socket.on("create_transport", ({ meetId }, callback) => {});

    //connect transport
    socket.on(
      "connect_transport",
      ({ dtlsParameters, meetId, transportId }, callback) => {}
    );

    //produce media
    socket.on(
      "produce_media",
      ({ kind, rtpParameters, room, transportId }, callback) => {}
    );

    //consume media
    socket.on(
      "consume_media",
      ({ room, rtpCapabilities, transportId }, callback) => {}
    );

    //consume new producer
    socket.on(
      "consume_new_producer",
      ({ transportId, producerId, room, rtpCapabilities }, callback) => {}
    );

    //cleanup
    socket.on("disconnet", () => {});
  });
};

export default meetHandler;
