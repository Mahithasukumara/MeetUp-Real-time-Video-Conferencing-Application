import { createRouter, createWorker } from "../MediaSoup/MediaSoupConfig.js";

class MediaSoupService {
  constructor() {
    this.worker = null;
    this.router = null;
    this.socketToUsers = new Map();
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
  async createConsumerForProduer() {}
  async createConsumersForAllProducers() {}
  getNoOfParticipents() {}
  async cleanUp() {}
}

export default await new MediaSoupService().init();
