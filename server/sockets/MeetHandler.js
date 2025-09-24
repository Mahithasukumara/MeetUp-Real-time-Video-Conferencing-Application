import { Store } from "../store/store.js";
import isValidFormat from "../utilities/validcode.utility.js";
import MediaSoupService from "../MediaSoup/MediaSoupService.js";
const meetHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("health_check", (callback) => {
      callback({ status: 200 });
    });
    //if it is a create mode then
    // code already has => reply error

    //if it is join mode
    // code not present => reply error
    socket.on("is_valid_code", ({ meetId, isCreateMode }, callback) => {
      if (!isValidFormat(meetId)) {
        return callback({
          error: { message: "Invalid Meet Id format" },
          success: false,
          status: 400,
        });
      }
      if (isCreateMode) {
        if (Store.rooms.has(meetId)) {
          return callback({
            error: { message: "Invalid meet Id" },
            success: false,
            status: 400,
          });
        }
      } else {
        if (!Store.rooms.has(meetId)) {
          console.log(meetId, isCreateMode);
          return callback({
            error: { message: "Invalid meet Id" },
            success: false,
            status: 400,
          });
        }
      }
      return callback({ data: { success: true }, status: 200, success: true });
    });

    //create new meet
    socket.on("new_meet", async ({ name, email, meetId }, callback) => {
      if (!name || !email || !meetId) {
        return callback({
          error: { message: "All fields are required" },
          success: false,
          status: 400,
        });
      }
      if (!isValidFormat(meetId)) {
        return callback({
          error: { message: "Invalid Meet Id formate" },
          success: false,
          status: 400,
        });
      }

      try {
        const msService = new MediaSoupService({ name, email, meetId });
        await msService.init();
        Store.rooms.set(meetId, msService);
        socket.join(meetId);

        return callback({
          success: true,
          user: { name, email, meetId },
          status: 200,
        });
      } catch (error) {
        console.log(error);
        return callback({
          error: { message: "Internal Server Error" },
          success: false,
          status: 500,
        });
      }
    });

    //join a meet by id
    socket.on("join_meet", async ({ name, email, meetId }, callback) => {
      try {
        if (!name || !email || !meetId) {
          return callback({
            error: { message: "All fields are required" },
            success: false,
            status: 400,
          });
        }
        if (!isValidFormat(meetId)) {
          return callback({
            error: { message: "Invalid Meet Id formate" },
            success: false,
            status: 400,
          });
        }

        const msService = Store.rooms.get(meetId);
        if (!msService) {
          return callback({
            error: { message: "Invalid Meet Id" },
            success: false,
            status: 400,
          });
        }

        msService.addParticipent(socket.id, { name, email, meetId });
        const user = msService.participents.get(socket.id);
        if (!user) {
          return callback({
            error: { message: "something went wrong" },
            success: false,
            status: 400,
          });
        }
        socket.join(meetId);
        socket.broadcast.to(meetId).emit("new_participent", {
          user: { ...user },
          success: true,
          status: 200,
        });
        return callback({
          success: true,
          user: { name, email, meetId },
          status: 200,
        });
      } catch (error) {
        console.log(error);
        return callback({
          error: { message: "Internal Server Error" },
          success: false,
          status: 500,
        });
      }
    });

    //rtp capabilities
    socket.on("rtp_capabilities_req", ({ meetId }, callback) => {});

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
