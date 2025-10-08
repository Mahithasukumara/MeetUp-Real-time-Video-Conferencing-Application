import { create } from "zustand";

const useStore = create((set) => ({
  Transports: { receiveTransport: null, sendTransport: null },
  Media: { cam: null, screen: null, camAudio: null, screenAudio: null },
  Participents: new Map(), //{socketId : {name, email}}
  ActiveParticipent: "",
  Producers: new Map(), // {producerId : producer}
  Consumers: new Map(), // {consumerId : consumer}
  MeetMode: "present", // gallery, present

  updateMeetMode: (MeetMode) => set((state) => ({ ...state, MeetMode })),
  updateActivePerson: (socketId) =>
    set((state) => ({ ...state, ActiveParticipent: socketId })),
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

  addParticipent: (socketId, participent) =>
    set((state) => {
      const map = state.Participents;
      map.set(socketId, participent);
      return { ...state, Participents: map };
    }),
  removeParticipent: (socketId) =>
    set((state) => {
      const map = state.Participents;
      map.delete(socketId);
      return { ...state, Participents: map };
    }),

  addProducer: (producerId, producer) =>
    set((state) => {
      const map = state.Producers;
      map.set(producerId, producer);
      return { ...state, Producers: map };
    }),
  removeProducer: (producerId) =>
    set((state) => {
      map = state.Producers;
      map.delete(producerId);
      return { ...state, Producers: map };
    }),

  addConsumer: (consumerId, consumer) =>
    set((state) => {
      const map = state.Consumers;
      map.set(consumerId, consumer);
      return { ...state, Consumers: map };
    }),
  removeConsumer: (consumerId) =>
    set((state) => {
      const map = state.Consumers;
      map.delete(consumerId);
      return { ...state, Consumers: map };
    }),
}));

export default useStore;
