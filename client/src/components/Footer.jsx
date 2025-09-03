import React from 'react';
import wave from "../assets/wave2.svg";

function Footer() {
  return (
    <footer className="bg-transparent w-full -mt-49">
      <div>
      <div className="w-full">
        
        <img src={wave} alt="wave" className="w-full" />
      </div>
      <div className="flex items-center justify-center h-8">
        <p className="text-sm m-5 text-[#333333] text-center">
          © 2025 All rights reserved.
        </p>
      </div>
      </div>
    </footer>
  );
}

export default Footer;
