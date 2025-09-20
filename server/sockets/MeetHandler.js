import { Store } from "./store.js";
import isValidFormat from "../utilities/validcode.utility.js";
import MediaSoupService from "../MediaSoup/MediaSoupService.js";
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
    //if it is a create mode then
    // code already has => reply error

    //if it is join mode
    // code not present => reply error
    socket.on("is_valid_code", ({ meetId, isCreateMode }, callback) => {
      if (!isValidFormat(meetId)) {
        return callback({
          error: { message: "Invalid Meet Id formate" },
          success: false,
        });
      }
      if (isCreateMode) {
        if (Store.rooms.has(meetId)) {
          return callback({
            error: { message: "Invalid MeetId" },
            success: false,
          });
        }
      } else {
        if (!Store.rooms.has(meetId)) {
          return callback({
            error: { message: "Invalid MeetId" },
            success: false,
          });
        }
      }
      return callback({ success: true });
    });

    //create new meet
    socket.on("new_meet", async ({ name, email, meetId }, callback) => {
      if (!name || !email || !meetId) {
        return callback({
          error: { message: "All fields are required" },
          success: false,
        });
      }
      if (!isValidFormat(meetId)) {
        return callback({
          error: { message: "Invalid Meet Id formate" },
          success: false,
        });
      }
      const msService = new MediaSoupService({ name, email, meetId });
      await msService.init();
      rooms.set(meetId, msService);
      return callback({ success: true, user: { name, email, meetId } });
    });

    //join a meet by id
    socket.on("join_meet", async ({ name, email, meetId }, callback) => {
      if (!name || !email || !meetId) {
        return callback({
          error: { message: "All fields are required" },
          success: false,
        });
      }

      if (!isValidFormat(meetId)) {
        return callback({
          error: { message: "Invalid Meet Id formate" },
          success: false,
        });
      }

      const msService = Store.rooms.get(meetId);
      if (!msService) {
        return callback({
          error: { message: "Invalid Meet Id" },
          success: false,
        });
      }
      msService.addParticipent(socket.id, { name, email, meetId });
      const { user } = msService.participents.get(socket.Id);
      if (!user) {
        return callback({
          error: { message: "something went wrong" },
          success: false,
        });
      }
      return callback({ success: true });
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
