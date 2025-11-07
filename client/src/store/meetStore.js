import { create } from "zustand";

const useStore = create((set, get) => ({
  Transports: { receiveTransport: null, sendTransport: null },
  Media: { cam: null, screen: null, camAudio: null, screenAudio: null },
  participants: new Map(), //{socketId : {name, email, consumerId:[], isPresenting: false}}
  // socketIdsOrder: [],
  //  {
  //   socketId: "",
  //   isPresenting: false,
  //   speakingScore: 0,
  //   isSpeaking: false,
  //   hasVideo: false,
  //   priority: 0,
  // }
  ActiveParticipant: "",
  Producers: new Map(), // {producerId : producer}
  Consumers: new Map(), // {consumerId : consumer}
  MeetMode: "gallery", // gallery, present

  updateMeetMode: (MeetMode) => set((state) => ({ ...state, MeetMode })),
  updateActivePerson: (socketId) =>
    set((state) => ({ ...state, Activeparticipant: socketId })),
  updateTransports: (key, value) =>
    set((state) => ({
      ...state,
      Transports: { ...state.Transports, [key]: value },
    })),
  clearTransports: (key) =>
    set((state) => ({
      ...state,
      Transports: { ...state.Transports, [key]: null },
    })),

  updateMedia: (key, value) =>
    set((state) => ({ ...state, Media: { ...state.Media, [key]: value } })),
  clearMedia: (key) =>
    set((state) => ({ ...state, Media: { ...state.Media, [key]: null } })),

  addParticipant: ({ name, email, socketId }) =>
    set((state) => {
      const map = state.participants;
      map.set(socketId, { name, email, consumerId: [], isPresenting: false });
      return { ...state, participants: map };
    }),
  removeParticipant: (socketId) =>
    set((state) => {
      const map = state.participants;
      map.delete(socketId);
      return { ...state, participants: map };
    }),
  addConsumerIdToParticipant: ({ socketId, consumerId }) =>
    set((state) => {
      const map = state.participants;
      const participant = map.get(socketId);
      if (participant) {
        participant.consumerId.push(consumerId);
        map.set(socketId, participant);
      }
      return { ...state, participants: map };
    }),

  removeConsumerIdFromParticipant: ({ socketId, consumerId }) =>
    set((state) => {
      const map = state.participants;
      const participant = map.get(socketId);
      if (participant) {
        participant.consumerId = participant.consumerId.filter(
          (id) => id !== consumerId
        );
        map.set(socketId, participant);
      }
      return { ...state, participants: map };
    }),

  getConsumerIdsFromParticipant: (socketId) => {
    const { participants } = get();
    const participant = participants.get(socketId);
    return participant ? participant.consumerId : [];
  },

  addProducer: ({ producerId, producer }) =>
    set((state) => {
      const map = state.Producers;
      map.set(producerId, producer);
      return { ...state, Producers: map };
    }),
  removeProducer: ({ producerId }) =>
    set((state) => {
      map = state.Producers;
      map.delete(producerId);
      return { ...state, Producers: map };
    }),

  addConsumer: ({ consumerId, consumer }) =>
    set((state) => {
      const map = state.Consumers;
      map.set(consumerId, consumer);
      return { ...state, Consumers: map };
    }),
  removeConsumer: ({ consumerId }) =>
    set((state) => {
      const map = state.Consumers;
      map.delete(consumerId);
      return { ...state, Consumers: map };
    }),
}));

export default useStore;
