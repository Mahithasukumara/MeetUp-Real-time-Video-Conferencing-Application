import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

import ParticipantSec from "./ParticipantSec";
const Participants = ({
  arr = [
    { name: "user name 1", socketId: "user socket id 1" },
    { name: "user name 2", socketId: "user socket id 2" },
    { name: "user name 3", socketId: "user socket id 3" },
    { name: "user name 4", socketId: "user socket id 4" },
    { name: "user name 5", socketId: "user socket id 5" },
    { name: "user name 6", socketId: "user socket id 6" },
    { name: "user name 7", socketId: "user socket id 7" },
    { name: "user name 8", socketId: "user socket id 8" },
    { name: "user name 9", socketId: "user socket id 9" },
    { name: "user name 10", socketId: "user socket id 10" },
    { name: "user name 11", socketId: "user socket id 11" },
    { name: "user name 12", socketId: "user socket id 12" },
    { name: "user name 13", socketId: "user socket id 13" },
    { name: "user name 14", socketId: "user socket id 14" },
  ],
}) => {
  const [isSelected, setIsSelected] = useState("");
  return (
    <div className="h-full">
      {/* search section */}
      <div className="flex flex-col gap-3">
        <span className="block text-sm">Participants</span>
        <div className=" flex gap-1 px-1">
          <input
            type="text"
            className="border rounded flex-grow p-1"
            placeholder="Search participants..."
          />
          <button
            className="border rounded px-2 cursor-pointer"
            onClick={() => {}}
          >
            <FiSearch className="h-7 w-7  p-1" />
          </button>
        </div>
        <div className="h-105 flex-grow overflow-y-scroll">
          {arr.map((item, index) => (
            <ParticipantSec
              key={index}
              name={item.name}
              socketId={item.socketId}
              selectedSocketId={isSelected}
              setIsSelected={setIsSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Participants;
