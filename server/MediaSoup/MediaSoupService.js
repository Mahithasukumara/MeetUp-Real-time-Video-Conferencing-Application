import { createRouter, createWorker } from "../MediaSoup/MediaSoupConfig.js";

class MediaSoupService {
  constructor(user) {
    this.worker = null;
    this.router = null;
    this.participants = new Map();
    //   socketId: {
    //     transportIds: [],
    //     producerIds: [],
    //     consumerIds: [],
    //     user: { email: '', name: '', meetId: '' }
    //   }
    this.transports = new Map();
    this.producers = new Map();
    this.consumers = new Map();

    this.audioObserver = null;
    this.user = user;
    this.lastVolumes = null;
  }
  async init() {
    if (!this.worker) {
      this.worker = await createWorker();
    }
    if (!this.router) {
      this.router = await createRouter(this.worker);
    }
    this.audioObserver = await this.router.createAudioLevelObserver({
      threshold: -50,
      maxEntries: 1,
      interval: 200,
    });
    this.audioObserver.on("volumes", (volumes) => {
      this.lastVolumes = volumes;
    });
    this.audioObserver.on("silence", () => {
      this.lastVolumes = null;
    });
  }
  async createWebRtcTransport({ socketId, direction }) {
    const transport = await this.router.createWebRtcTransport({
      listenIps: [
        { ip: "0.0.0.0", announcedIp: process.env.MEDIASOUP_ANOUNCED_IP },
      ],
      enableUdp: true,
      enableTcp: true,
      preferTcp: true,
      appData: {
        socketId,
        direction,
      },
    });

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") {
        transport.close();
      }
    });

    transport.on("close", () => {
      console.log("Transport closed", transport.id);
      const peer = this.participants.get(socketId);
      const indexToDel = peer.transportIds.indexOf(transport.id);
      if (indexToDel != -1) peer.transportIds.splice(indexToDel, 1);

      this.transports.delete(transport.id);
    });

    return transport;
  }
  async createTransport({ socketId, direction }) {
    const transport = await this.createWebRtcTransport({ socketId, direction });
    this.participants.get(socketId).transportIds.push(transport.id);
    this.transports.set(transport.id, transport);
    return transport;
  }
  async connectTransport({ dtlsParameters, transportId }) {
    const transport = this.transports.get(transportId);
    await transport.connect({ dtlsParameters });
    return;
  }
  async createProducer({ kind, rtpParameters, transportId, socketId }) {
    const transport = this.transports.get(transportId);
    const peer = this.participants.get(socketId);
    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData: { peerId: socketId, kind },
    });
    producer.on("transportclose", () => {
      console.log("transport close");
      producer.close();
    });
    producer.on("close", () => {
      console.log("producer closed");
      const indexToDel = peer.producerIds.indexOf(producer.id);
      if (indexToDel != -1) peer.producerIds.splice(indexToDel, 1);
    });
    peer.producerIds.push(producer.id);
    this.producers.set(producer.id, producer);
    if (producer.kind == "audio") await this.audioObserver.addProducer({ producerId: producer.id });
    return producer;
  }
  async createConsumerForProducer({
    transportId,
    producerId,
    rtpCapabilities,
    socketId,
  }) {
    if (!this.router.canConsume({ rtpCapabilities, producerId }))
      return;
    const peer = this.participants.get(socketId);
    const transport = this.transports.get(transportId);
    if (!transport) return;
    const { peerId } = this.producers.get(producerId).appData;
    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: false,
      appData: {
        consumerPeerId: socketId,
        producerPeerId: peerId,
      },
    });
    consumer.on("transportclose", () => {
      consumer.close();
    });
    consumer.on("producerclose", () => {
      consumer.close();
    });
    consumer.on("close", () => {
      this.consumers.delete(consumer.id);
      const indexToDel = peer.consumerIds.indexOf(consumer.id);
      if (indexToDel != -1) peer.consumerIds.splice(indexToDel, 1);
    });

    peer.consumerIds.push(consumer.id);
    this.consumers.set(consumer.id, consumer);
    return {
      consumer: {
        producerId,
        consumerId: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        appData: {
          consumerPeerId: socketId,
          producerPeerId: peerId,
        },
      },
    };
  }
  async createConsumersForAllProducers({
    transportId,
    rtpCapabilities,
    socketId,
  }) {
    const peer = this.participants.get(socketId);
    const transport = this.transports.get(transportId);
    const consumersSet = [];

    for (const [producerId, producer] of this.producers) {
      if (producer.appData.peerId === socketId) continue;
      const consumer = await transport.consume({
        producerId,
        rtpCapabilities,
        paused: false,
        appData: {
          consumerPeerId: socketId,
          producerPeerId: producer.appData.peerId,
        },
      });
      consumer.on("transportclose", () => {
        consumer.close();
      });
      consumer.on("producerclose", () => {
        consumer.close();
      });
      consumer.on("close", () => {
        this.consumers.delete(consumer.id);
        const indexToDel = peer.consumerIds.indexOf(consumer.id);
        if (indexToDel != -1) peer.consumerIds.splice(indexToDel, 1);
      });

      peer.consumerIds.push(consumer.id);
      this.consumers.set(consumer.id, consumer);
      consumersSet.push({
        producerId,
        consumerId: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        appData: consumer.appData,
      });
    }

    return consumersSet;
  }
  getNoOfParticipants() {
    return this.participants.size;
  }
  getParticipants() {
    const participants = [];
    for (const [socketId, peer] of this.participants) {
      participants.push({ ...peer.user, socketId });
    }
    return participants;
  }
  async cleanUp({ socketId }) {
    const peer = this.participants.get(socketId);
    if (!peer) return;
    for (const transportId of peer.transportIds) {
      const transport = this.transports.get(transportId);
      if (transport) {
        transport.close();
      }
      this.transports.delete(transportId);
    }
    const user = peer.user;
    this.participants.delete(socketId);
    return user;
  }

  addParticipant(socketId, user) {
    this.participants.set(socketId, {
      user,
      transportIds: [],
      producerIds: [],
      consumerIds: [],
    });
    console.log("all participants", this.participants);
  }
  getActiveSpeaker() {
    if (!this.lastVolumes || this.lastVolumes.length === 0) return null;
    return this.lastVolumes[0].producer.appData.peerId;
  }
}

export default MediaSoupService;
