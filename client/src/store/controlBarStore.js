import { create } from "zustand";

const useStore = create((set) => ({
  isMicOn: false,
  isCamOn: false,
  isSideBarOpen: false,

  ToggleMic: () => set((state) => ({ isMicOn: !state.isMicOn })),

  ToggleCam: () => set((state) => ({ isCamOn: !state.isCamOn })),

  ToggleSideBar: () =>
    set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
}));
