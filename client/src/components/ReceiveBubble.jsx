import React from "react";

const ReceiveBubble = ({ msg, time, from }) => {
  return (
    <div className=" flex items-center text-sm text-wrap justify-start ">
      <span
        className="bg-[#27391C] text-white/80 p-2  rounded-lg relative max-w-[80%] flex-col gap-1 break-words
                    after:content-[''] after:h-3 after:w-3 after:bg-[#27391C]  
                    after:absolute after:left-[0px]  after:bottom-[0px]"
      >
        <span className="text-[#67AE6E] font-semibold">{from}</span>
        <span className="flex gap-1">
          <p className="">{msg}</p>
          <span className="z-99  text-[10px] bottom-0 justify-end self-end">
            {time}
          </span>
        </span>
      </span>
    </div>
  );
};

export default ReceiveBubble;
