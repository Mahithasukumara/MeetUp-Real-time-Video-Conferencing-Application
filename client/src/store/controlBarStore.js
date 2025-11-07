import { create } from "zustand";

const useStore = create((set) => ({
  isMicOn: false,
  isCamOn: false,
  isPresenting: false,
  isSideBarOpen: false,
  isParticipantPanelOpen: false,

  ToggleMic: () => set((state) => ({ isMicOn: !state.isMicOn })),
  ToggleParticipantPanel: () =>
    set((state) => ({
      isParticipantPanelOpen: !state.isParticipantPanelOpen,
    })),

  ToggleCam: () => set((state) => ({ isCamOn: !state.isCamOn })),
  TogglePresent: () => set((state) => ({ isPresenting: !state.isPresenting })),
  ToggleSideBar: () =>
    set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
}));
export default useStore;
