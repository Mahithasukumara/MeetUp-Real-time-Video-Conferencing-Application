import React from "react";
import Wave from "../assets/wave.svg";
import homeImage from "../assets/svgImage.png";
import homepage from "../assets/homepage.png";

const Home = () => {
  return (
    <div className="flex items-center justify-between ml-30 p-10"> 
     <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold mb-2">
         Meet, Share, and Create Together 
          </h1>
        <p className="text-gray-600 mb-4">
         Transform meetings into meaningful interactions
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Create meeting
          </button>
          <button className="bg-white text-gray-800 border px-6 py-2 rounded-md hover:bg-gray-100 transition">
            Join with code or link
          </button>
        </div>
      </div>

      <div className="-mt-10">
        <img
          src={homepage}
          alt="homepage image"
          width="400"
          height="400"
        />
      </div>
    </div>
  );
};

export default Home;
