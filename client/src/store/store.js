import { create } from "zustand";
import io from "socket.io-client";
const useStore = create((set) => ({
  Socket: io.connect(import.meta.env.VITE_SERVER_URL),
  User: { name: "", email: "", meetId: "" },
  Device: null,
  MeetId: null,
  FormMode: "create", // join, create, link,

  setSocket: (socket) => set((state) => ({ ...state, Socket: socket })),
  setUser: ({ name, email, meetId }) =>
    set((state) => ({ ...state, User: { name, email, meetId } })),
  updateFormMode: (FormMode) => set((state) => ({ ...state, FormMode })),
  setDevice: (Device) => set((state) => ({ ...state, Device })),
  setMeetId: (meetId) => set((state) => ({ ...state, MeetId: meetId })),
}));

export default useStore;
