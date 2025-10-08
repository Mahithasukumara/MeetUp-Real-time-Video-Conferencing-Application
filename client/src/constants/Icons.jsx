import {
  HiOutlineVideoCamera,
  HiOutlineVideoCameraSlash,
} from "react-icons/hi2";
import { BsMicFill, BsMicMute } from "react-icons/bs";
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { FiLayout } from "react-icons/fi";
import {
  GoSidebarExpand,
  GoSidebarCollapse,
  GoShareAndroid,
} from "react-icons/go";
import useStoreControlBar from "../store/controlBarStore";

export const useIcons = () => {
  const isCamOn = useStoreControlBar((state) => state.isCamOn);
  const isMicOn = useStoreControlBar((state) => state.isMicOn);
  const isPresenting = useStoreControlBar((state) => state.isPresenting);
  const isSideBarOpen = useStoreControlBar((state) => state.isSideBarOpen);

  const toggleSideBar = useStoreControlBar((state) => state.ToggleSideBar);

  return [
    {
      name: "camera on/off",
      onIcon: <HiOutlineVideoCamera className="h-9 w-9" />,
      offIcon: <HiOutlineVideoCameraSlash className="h-9 w-9" />,
      onClick: () => {},
      isEnabled: isCamOn,
    },
    {
      name: "microphone on/off",
      onIcon: <BsMicFill className="h-9 w-9" />,
      offIcon: <BsMicMute className="h-9 w-9" />,
      onClick: () => {},
      isEnabled: isMicOn,
    },
    {
      name: "present",
      onIcon: <MdOutlineScreenShare className="h-9 w-9" />,
      offIcon: <MdOutlineStopScreenShare className="h-9 w-9" />,
      onClick: () => {},
      isEnabled: isPresenting,
      disable: false,
    },
    {
      name: "leave meet",
      onIcon: <ImExit className="h-9 w-9" />,
      offIcon: <ImExit className="h-9 w-9" />,
      onClick: () => {},
    },
    {
      name: "layout coming soon..",
      onIcon: <FiLayout className="h-9 w-9" />,
      offIcon: <FiLayout className="h-9 w-9" />,
      onClick: () => {},
    },
    {
      name: "chat/participants",
      onIcon: <GoSidebarCollapse className="h-9 w-9" />,
      offIcon: <GoSidebarExpand className="h-9 w-9" />,
      onClick: () => {
        console.log("onclick");
        toggleSideBar();
      },
      isEnabled: isSideBarOpen,
    },
    {
      name: "share",
      onIcon: <GoShareAndroid className="h-9 w-9" />,
      offIcon: <GoShareAndroid className="h-9 w-9" />,
      onClick: () => {},
    },
  ];
};

export default useIcons;
