import React, { useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";
const ParticipantSec = ({
  socketId = "",
  name = "User",
  selectedSocketId = "",
  setIsSelected,
}) => {
  const secRef = useRef();
  const boxRef = useRef();
  // window.addEventListener("click", (e) => {
  //   if (e.target !== secRef.current && e.target !== boxRef.current) {
  //     setIsSelected("");
  //   }
  // });
  return (
    <div
      className="h-8 border items-center flex px-1 rounded relative text-sm my-1"
      ref={secRef}
    >
      <div className="flex items-center gap-2 flex-grow">
        <span className="block flex-grow">{name}</span>
        <span className="">
          <IoMdMore
            className="h-7 w-7 cursor-pointer p-1"
            onClick={() => setIsSelected(socketId)}
          />
        </span>
      </div>
      {selectedSocketId === socketId && (
        <div
          ref={boxRef}
          className="absolute bg-[#1F7D53] border rounded shadow-lg right-1 top-10 w-40 z-10"
        >
          <ul className="flex flex-col">
            <li className="p-1 hover:bg-white/80 hover:text-[#1F7D53] cursor-pointer border-b">
              Message privately
            </li>
            <li className="p-1 hover:bg-white/80 hover:text-[#1F7D53] cursor-pointer">
              more
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParticipantSec;
