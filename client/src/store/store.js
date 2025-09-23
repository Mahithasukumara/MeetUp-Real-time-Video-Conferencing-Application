import { Socket } from "socket.io-client";
import { create } from "zustand";

const useStore = create((set) => ({
  Socket: null,
  User: { name: "", email: "", meetId: "" },
  Device: null,
  MeetId: null,
  FormMode: "create", // join, create, link,
  Transports: { receiveTransport: null, sendTransport: null },
  Media: { cam: null, screen: null, camAudio: null, screenAudio: null },
  Participents: new Map(), //{socketId : {name, email, cam, screen, camAudio, screenAudio}}

  Producers: new Map(), // {producerId : producer}
  Consumers: new Map(), // {consumerId : consumer}

  setSocket: (socket) => set((state) => ({ ...state, Socket: socket })),
  setUser: ({ name, email, meetId }) =>
    set((state) => ({ ...state, User: { name, email, meetId } })),
  updateFormMode: (FormMode) => set((state) => ({ ...state, FormMode })),
  setDevice: (Device) => set((state) => ({ ...state, Device })),
  setMeetId: (meetId) => set((state) => ({ ...state, MeetId: meetId })),
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
