import React,{useState,useRef, useEffect} from "react";
// import { FaVideo,FaVideoSlash,FaMicrophoneAlt ,FaMicrophoneAltSlash   } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import VoiceVisualizer from "../components/VoiceVisualizer";


const Lobby = () => {
  const [isCameraOn,setIsCameraOn]=useState(false);
  const [isMicOn,setMicOn]=useState(false);
  const peopleCount=11
  const videoRef=useRef(null)
  useEffect( ()=>{
    let stream;
    if(isCameraOn){
     navigator.mediaDevices.getUserMedia({video:true})
     .then(s=>{
      stream=s;
      if(videoRef.current){
        videoRef.current.srcObject=stream;
        console.log("camera on :lobby")
      }})
      .catch(err=>{
        console.log(`error while starting camera : ${error}`)
      })
      }
      else{
        if (videoRef.current?.srcObject){
          let tracks=videoRef.current.srcObject.getTracks();
          tracks.forEach(track=>track.stop());
          videoRef.current.srcObject=null;
          console.log("camera off success")
        }
        else{
          console.log("camera off :lobby")
        }
      }
      return ()=>{
        if(stream){
          stream.getTracks().forEach(track=>track.stop());
        }
      }
    
  },[isCameraOn])
  return (
     <div>
     
      <div className="flex justify-center items-center bg-gray-100 min-h-screen font-poppins  ">
        <div className="flex flex-col items-center w-full max-w-4xl h-[200] bg-gray-900 text-white rounded-lg shadow-2xl p-4">
             {/* //logo */}
             <div className=" text-center mb-5">
                <IoIosPeople className="text-3xl text-green-500 mx-auto "></IoIosPeople>
                <h1 className=" text-xs font-semibold text-white mb-5">MeetUp</h1>
                <p className="">{peopleCount>0?`${peopleCount} people in the room`: `No one in the room`}</p>
             </div>
             {/* media */}
             <div className="flex  flex-col space-y-5  md:flex-row md:space-x-5 w-full mb-5">
               {/* for camera card */}
                <div className="flex-1 bg-gray-700 rounded-lg p-4">
                    <div className="flex mb-5 justify-between items-center">
                       <span className="font-bold text-white">Camera</span>
                         <button onClick={()=>setIsCameraOn(!isCameraOn)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isCameraOn?"bg-green-500":"bg-gray-400"}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transorm ${isCameraOn?"translate-x-6":"translate-x-1"}`}></span>
                           </button>
                    </div>
                    <div className="flex items-center justify-center w-full h-48 bg-gray-900 border border-gray-300 rounded-md overflow-hidden">
                      {isCameraOn?(<video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay playsInline />):(<p className="text-grey-400">Camera is off</p>)}

                    </div>

                </div>
                {/* microphone  */}
               
                  <div className="flex-1 bg-gray-700 rounded-lg p-4">
                    <div className="flex mb-5 justify-between items-center">
                       <span className="font-bold text-white">Microphone</span>
                         <button onClick={()=>setMicOn(!isMicOn)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isMicOn?"bg-green-500":"bg-gray-400"}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transorm ${isMicOn?"translate-x-6":"translate-x-1"}`}></span>
                           </button>
                    </div>
                    <div className="flex items-center justify-center w-full h-48 bg-gray-900 border border-gray-300 rounded-md overflow-hidden">
                         {isMicOn?(<div className="min-h-screen flex items-center justify-center bg-gray-900">
      <VoiceVisualizer />
    </div>):(<p className="text-grey-400">Microphone is not enabled</p>)}

                    </div>
                    </div>

                  </div>
                 {/* join button */}
              <button className="font-bold bg-green-500 h-12 w-25 rounded-lg shadow-md   hover:cursor-pointer hover:bg-green-600 transition-colors duration-300">Join</button>
              </div>
             
      </div>
    </div>
  )
}
    


export default Lobby;
