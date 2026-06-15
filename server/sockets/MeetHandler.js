import { Store } from "../store/store.js";
import isValidFormat from "../utilities/validcode.utility.js";
import MediaSoupService from "../MediaSoup/MediaSoupService.js";
import { createWorker, createRouter } from "../MediaSoup/MediaSoupConfig.js";
let worker;
let router;
const meetHandler = async (io) => {
  worker = await createWorker();
  router = await createRouter(worker);
  setInterval(() => {
    for (const [meetId, MediaSoupObj] of Store.rooms) {
      const activeSpeaker = MediaSoupObj.getActiveSpeaker() ?? null;
      io.to(meetId).emit("active_speaker", { socketId: activeSpeaker });
    }
  }, 200);

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
        msService.addParticipant(socket.id, { name, email, meetId });
        Store.socketToRoom.set(socket.id, meetId);
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
        Store.socketToRoom.set(socket.id, meetId);
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
    socket.on("rtp_capabilities_req", ({ meetId }, callback) => {
      try {
        if (!router) {
          return callback({
            error: { message: "Router not initialized" },
            success: false,
            status: 500
          })
        }
        const rtpCapabilities = router.rtpCapabilities;
        callback({
          success: true,
          data: rtpCapabilities,
          status: 200
        });
      }
      catch (err) {
        console.log("error sending RTP capabilities", err)
        callback({
          error: { message: "Failed to get RTP capabilites" },
          success: false,
          status: 500

        })
      }

    });

    //participants list
    socket.on("participants_list", ({ MeetId }, callback) => {
      const msService = Store.rooms.get(MeetId);
      if (!msService) return;
      const participantsList = msService.getParticipants();
      callback({ participantsList });
    });

    //create transport
    socket.on("create_transport", async ({ meetId }, callback) => {
      const msService = Store.rooms.get(meetId);
      console.log('create tranport called')
      const sendTransport = await msService.createTransport({ socketId: socket.id, direction: 'send' });
      const recvTransport = await msService.createTransport({ socketId: socket.id, direction: 'recv' });

      callback({
        success: true,
        sendTransport: {
          id: sendTransport.id,
          dtlsParameters: sendTransport.dtlsParameters,
          iceParameters: sendTransport.iceParameters,
          iceCandidates: sendTransport.iceCandidates,
        },
        recvTransport: {
          id: recvTransport.id,
          dtlsParameters: recvTransport.dtlsParameters,
          iceParameters: recvTransport.iceParameters,
          iceCandidates: recvTransport.iceCandidates,
        },
      })
    });

    //connect transport
    socket.on(
      "connect_transport",
      async ({ dtlsParameters, meetId, transportId }, callback) => {
        const msService = Store.rooms.get(meetId);
        await msService.connectTransport({ transportId, dtlsParameters });
        callback({
          success: true,
          status: 200
        });
      }
    );

    //produce media
    socket.on(
      "produce_media",
      async ({ kind, rtpParameters, meetId, transportId }, callback) => {
        const msService = Store.rooms.get(meetId);
        if (!msService) return;
        const producer = await msService.createProducer({
          socketId: socket.id,
          kind,
          rtpParameters,
          transportId,
        });
        callback({
          success: true,
          id: producer.id,
          status: 200
        });
      }
    );

    //consume media
    socket.on(
      "consume_media",
      async ({ MeetId, rtpCapabilities, transportId }, callback) => {
        const msService = Store.rooms.get(MeetId);
        if (!msService) return;
        const consumerSet = await msService.createConsumersForAllProducers({
          rtpCapabilities,
          transportId,
          socketId: socket.id,
        });

        callback({ consumerSet });
      }
    );

    //consume new producer
    socket.on(
      "consume_new_producer",
      async (
        { MeetId, transportId, producerId, rtpCapabilities },
        callback
      ) => {
        const msService = Store.rooms.get(MeetId);
        if (!msService) return;
        const consumer = await msService.createConsumerForProducer({
          transportId,
          producerId,
          rtpCapabilities,
        });
        callback({ consumer });
      }
    );

    //Messages
    socket.on("new_message", ({ type, msg, to, time }, callback) => {
      if (to === "everyone") {
        const meetId = Store.socketToRoom.get(socket.id);
        if (!meetId) {
          return callback({
            error: { message: "Invalid meet Id" },
            success: false,
            status: 400,
          });
        }
        socket.broadcast.to(meetId).emit("new_message", {
          type: "Receive",
          msg,
          from: Store.rooms.get(meetId).participents.get(socket.id).name,
          time,
        });

        callback({ success: true, status: 200 });
      } else {
        //to specific user
        const meetId = Store.socketToRoom.get(socket.id);
        if (!meetId) {
          return callback({
            error: { message: "Invalid meet Id" },
            success: false,
            status: 400,
          });
        }
        const msService = Store.rooms.get(meetId);
        const participent = msService.participents.get(to);
        if (!participent) {
          return callback({
            error: { message: "Invalid user Id" },
            success: false,
            status: 400,
          });
        }
        socket.to(to).emit("new_message", {
          type: "Receive",
          msg,
          from: Store.rooms.get(meetId).participents.get(socket.id).name,
          time,
        });
        callback({ success: true, status: 200 });
      }
    });
    //cleanup
    socket.on("disconnect", () => { });
  });
};

export default meetHandler;
