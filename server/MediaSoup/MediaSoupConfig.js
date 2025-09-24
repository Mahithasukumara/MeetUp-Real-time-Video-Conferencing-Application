import mediasoup from "mediasoup";

const createWorker = async () => {
  const newWorker = await mediasoup.createWorker({
    rtcMinPort: 10000,
    rtcMaxPort: 101000,
    logLevel: "warn",
  });
  console.log(`New worker created ${newWorker.pid}`);

  newWorker.on("died", () => {
    console.log("worker died");
    setTimeout(() => {
      process.exit();
    }, 2000);
  });
  return newWorker;
};
// (async()=>{
//     const worker=createWorker();
// })

const createRouter = async (worker) => {
  const mediaCodecs = [
    {
      kind: "audio",
      mimeType: "audio/opus",
      clockRate: 48000,
      channels: 2,
      preferredPayloadType: 98,
      rtcpFeedback: [{ type: "nack" }],
    },
    {
      kind: "video",
      mimeType: "video/VP8",
      clockRate: 90000,
      parameters: {
        "x-google-start-bitrate": 1500,
      },
      preferredPayloadType: 97,
      rtcpFeedback: [{ type: "nack" }],
    },
  ];
  try {
    const router = await worker.createRouter({ mediaCodecs });
    console.log("router created" + router.id);
    return router;
  } catch (error) {
    console.log("error while creating router:createRouter" + error);
  }
};

export { createRouter, createWorker };
