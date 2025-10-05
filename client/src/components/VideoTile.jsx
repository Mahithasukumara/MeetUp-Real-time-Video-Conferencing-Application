import React from "react";
import useMeetStore from "../store/meetStore.js";
import useIcons from "../constants/Icons.jsx";
import { BsMicFill, BsMicMute } from "react-icons/bs";
const VideoTile = ({ className }) => {
  // if the participent is not a producer
  // return (
  //   <div
  //     className={`${className} bg-[#27391C]  border rounded-lg aspect-video p-2 flex items-center`}
  //   >
  //     <span>user name</span>
  //   </div>
  // );
  return (
    <div
      className={`${className} rounded-lg border aspect-video p-2 flex flex-col`}
    >
      <div className="flex justify-between">
        <span className="flex justify-center items-center">user name</span>
        <span className="flex justify-center items-center border p-2 rounded-full">
          <BsMicMute className=" h-4 w-4" />
        </span>
      </div>
      <div className=" flex-grow flex justify-center items-center ">
        <span className="border p-3 rounded-full">U1</span>
      </div>
    </div>
  );
  // return <div className={`${className} rounded-lg border aspect-video`}></div>;
};

export default VideoTile;
