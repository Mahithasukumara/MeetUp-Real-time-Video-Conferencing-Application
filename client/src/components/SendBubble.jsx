import React from "react";

const SendBubble = ({ msg, time }) => {
  return (
    <div className="p-1 flex items-center text-wrap justify-end">
      <span
        className="flex gap-1 bg-[#255F38] p-2 rounded-xl relative max-w-[80%]  break-words
                    after:content-[''] after:h-3 after:w-3 after:bg-[#255F38] 
                    after:absolute after:right-[0px]  after:bottom-[0px]"
      >
        <p className="">{msg}</p>
        <span className="z-99   text-[10px] bottom-0 justify-end self-end">
          {time}
        </span>
      </span>
    </div>
  );
};

export default SendBubble;
