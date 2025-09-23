import { createRouter, createWorker } from "../MediaSoup/MediaSoupConfig.js";

class MediaSoupService {
  constructor(user) {
    this.worker = null;
    this.router = null;
    this.participents = new Map();
    //   socketId: {
    //     transportId: [],
    //     producerId: [],
    //     consumersId: [],
    //     user: { email: '', name: '', room: '' }
    //   }
    this.transports = new Map();
    this.producers = new Map();
    this.consumers = new Map();

    this.audioLevelObserver = null;
    this.user = user;
  }
  static async init() {
    if (!this.worker) {
      this.worker = await createWorker();
    }
    if (!this.router) {
      this.router = await createRouter(this.worker);
    }
  }
  async createWebRtcRouter() {}
  async createTransport() {}
  async connectTransport() {}
  getTransportById() {}
  async createProducer() {}
  getProducerById() {}
  getConsumerById() {}
  async createConsumerForProducer() {}
  async createConsumersForAllProducers() {}
  getNoOfParticipents() {}
  async cleanUp() {}

  addParticipent(socketId, user) {
    this.addParticipent.set(socketId, {
      user,
      transportsId: [],
      producersId: [],
      consumersId: [],
    });
  }
}

export default new MediaSoupService();
