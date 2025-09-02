import React from "react";

const Button = ({ content }) => {
  return (
    <div>
      <button className="bg-[#E1EEBC] px-4 py-2 rounded-md hover:scale-105 duration-300">
        {content}
      </button>
    </div>
  );
};

export default Button;
