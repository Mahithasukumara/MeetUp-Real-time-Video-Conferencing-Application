import React, { useState, useRef, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast, Slide } from "react-toastify";
import { IoIosPeople } from "react-icons/io";
import VoiceVisualizer from "../components/VoiceVisualizer";
import { Socket } from "socket.io-client";
import useStore from "../store/store";
import useMeetStore from "../store/meetStore";
import { Device } from "mediasoup-client";
import { useNavigate } from "react-router-dom";
import useControlBarStore from "../store/controlBarStore"

const Lobby = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setMicOn] = useState(false);

  const peopleCount = 11

  const videoRef = useRef(null)
  const [device, setDevice] = useState();
  const updateDevice = useStore((state) => state.updateDevice)
  const Device_ = useStore((state) => state.Device)
  const updateTransports = useMeetStore((state) => state.updateTransports);
  const meetId = useStore((state) => state.MeetId);
  const [rtpCapabilities, setRtpCapabilities] = useState(null);
  const socket = useStore((state) => state.Socket);
  const ToggleMic = useControlBarStore((state) => state.ToggleMic);
  const ToggleCam = useControlBarStore((state) => state.ToggleCam)
  const navigate = useNavigate()

  const JoinMeet = () => {
    navigate('/meeting')
  }


  useEffect(() => {
    if (isCameraOn) {
      ToggleCam();
    }
    let stream;
    let camerapermission;

    const handleCameraSettings = async () => {
      try {
        camerapermission = await navigator.permissions.query({
          name: "camera",
        });
        camerapermission.onchange = () => {
          if (camerapermission.state === "denied") {
            if (videoRef.current?.srcObject) {
              videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
              videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
          }
        };
        if (camerapermission.state === "denied") {
          if (videoRef.current?.srcObject) {
            videoRef.current.srcObject
              .getTracks()
              .forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }
          if (isCameraOn) {
            setIsCameraOn(false);
            console.log("Camera turned off due to permissions");
            toast.error("Camera access is blocked in browser settings");
            return;
          }
        }
        if (isCameraOn) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            console.log("camera on:lobby");
            toast.success("Camera is now on!");
          } catch (err) {
            console.log("Error while accessing camera");
            setIsCameraOn(false);
            toast.error(
              "Unable to access camera.Please allow permission in browser settings"
            );
          }
        } else {
          if (videoRef.current?.srcObject) {
            let tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            console.log("cam turned off;");
          }
        }
      } catch (err) {
        console.log("error in camera settings: " + err);
        setIsCameraOn(false);
        toast.error("Failed to turn on camera");
      }
    };
    handleCameraSettings();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {

    if (isMicOn) {
      ToggleMic();
    }
    let stream;
    let micpermission;
    const handleMicrophoneSettings = async () => {
      try {
        micpermission = await navigator.permissions.query({
          name: "microphone",
        });
        micpermission.onchange = () => {
          if (micpermission.state === "denied") {
            if (stream) {
              stream.getTracks().forEach((track) => track.stop());
            }
            setMicOn(false);
          }
        };
        if (micpermission.state === "denied") {
          if (isMicOn) {
            setMicOn(false);
            console.log("Microphone turned off due to permissions");
            toast.error("Microphone access is blocked in browser settings");
            return;
          }
        }
        if (isMicOn) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Mic on:lobby");
            toast.success("Microphone is now on!");
          } catch (err) {
            console.log("Error while accessing Microphone");
            setMicOn(false);
            toast.error(
              "Unable to access Microphone.Please allow permission in browser settings"
            );
          }
        } else {
          if (stream) {
            stream.getTracks.forEach((track) => track.stop());
            console.log("cam turned off;");
          }
        }
      } catch (err) {
        console.log("error in microphone settings: " + err);
        setMicOn(false);
        toast.error("Failed to turn on Microphone");
      }
    };
    handleMicrophoneSettings();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isMicOn])
  useEffect(() => {
    if (!socket) {
      return;
    }
    const getRouterRtpCapabilities = async () => {
      socket.emit("rtp_capabilities_req", { meetId }, (response) => {
        if (response.success) {
          console.log("Received RTP Capabilities:", response.data);
          setRtpCapabilities(response.data);
        } else {
          console.error("Error:", response.error?.message);
        }
      })
    }
    getRouterRtpCapabilities();
  }, [socket]);

  async function setupTransports(deviceInstance) {
    try {
      if (!socket || !deviceInstance) return;
      console.log('am i called setupTransports??');
      socket.emit("create_transport", { meetId }, async ({ success, sendTransport, recvTransport }) => {
        if (!success) {
          console.log("transport not created");
        }
        console.log('is device exists', deviceInstance);
        console.log('tranport details here', sendTransport, recvTransport);
        const sendTransport_ = await deviceInstance.createSendTransport({
          ...sendTransport
        });
        const receiveTransport = await deviceInstance.createRecvTransport({
          ...recvTransport,
        })
        console.log("is transports exits in lobby", sendTransport_, receiveTransport)
        sendTransport_.on("connect", ({ dtlsParameters }, callback) => {
          socket.emit(
            "connect_transport",
            {
              dtlsParameters,
              transportId: sendTransport.id,
              meetId,
            },
            ({ success, status }) => {
              console.log("ACK received success", success);
              callback();
              console.log("sendTransport is connected");
            }
          );
        });
        sendTransport_.on(
          "produce",
          ({ kind, rtpParameters }, callback, errback) => {
            console.log("transport produce triggered");
            socket.emit(
              "produce_media",
              {
                kind,
                rtpParameters,
                meetId,
                transportId: sendTransport.id,
              },
              ({ id }) => {
                console.log("Ack from send transport");
                callback({ id });
              }
            );
          }
        );

        receiveTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
          socket.emit(
            "connect_transport",
            {
              dtlsParameters,
              transportId: recvTransport.id,
              meetId,
            },
            ({ success, status }) => {
              console.log("ACK received success", success);
              callback();
              console.log("receiveTransport is connected");
            }
          );
        })

        updateTransports("sendTransport", sendTransport_);
        updateTransports("receiveTransport", receiveTransport);
      });
    }
    catch (error) {
      console.log("error at creating tranports and connecting them", error);
    }
  }

  useEffect(() => {
    const createDevice = async () => {
      if (!rtpCapabilities) return;
      try {
        const deviceInstance = new Device();
        await deviceInstance.load({ routerRtpCapabilities: rtpCapabilities });
        setDevice(deviceInstance);
        console.log("Device created", deviceInstance);
        updateDevice(deviceInstance);
        await setupTransports(deviceInstance);
      }
      catch (e) {
        console.log(`errror while creating device ${e}`)
      }
    }
    createDevice();
  }, [rtpCapabilities]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Slide}
      />
      <div className="flex justify-center items-center bg-gray-100 min-h-screen font-poppins  ">
        <div className="flex flex-col items-center w-full max-w-4xl h-[200] bg-gray-900 text-white rounded-lg shadow-2xl p-4">
          {/* //logo */}
          <div className=" text-center mb-5">
            <IoIosPeople className="text-3xl text-green-500 mx-auto "></IoIosPeople>
            <h1 className=" text-xs font-semibold text-white mb-5">MeetUp</h1>
            <p className="">{peopleCount > 0 ? `${peopleCount} people in the room` : `No one in the room`}</p>
          </div>
          {/* media */}
          <div className="flex  flex-col space-y-5  md:flex-row md:space-x-5 w-full mb-5">
            {/* for camera card */}
            <div className="flex-1 bg-gray-700 rounded-lg p-4">
              <div className="flex mb-5 justify-between items-center">
                <span className="font-bold text-white">Camera</span>
                <button onClick={() => setIsCameraOn(!isCameraOn)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isCameraOn ? "bg-green-500" : "bg-gray-400"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transorm ${isCameraOn ? "translate-x-6" : "translate-x-1"}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-center w-full h-48 bg-gray-900 border border-gray-300 rounded-md overflow-hidden">
                {isCameraOn ? (<video ref={videoRef} className="w-full h-full rounded-md object-cover" autoPlay playsInline />) :
                  (<p className="text-grey-400 text-center w-full">Your camera is off</p>)}

              </div>

            </div>
            {/* microphone  */}

            <div className="flex-1 bg-gray-700 rounded-lg p-4">
              <div className="flex mb-5 justify-between items-center">
                <span className="font-bold text-white">Microphone</span>
                <button onClick={() => setMicOn(!isMicOn)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isMicOn ? "bg-green-500" : "bg-gray-400"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transorm ${isMicOn ? "translate-x-6" : "translate-x-1"}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-center w-full h-48 bg-gray-900 border border-gray-300 rounded-md overflow-hidden">
                {isMicOn ? (
                  <VoiceVisualizer isMicOn={isMicOn} className="w-full h-full" />
                ) : (
                  <p className="text-grey-400  text-center w-full">Your mic is off</p>
                )}
              </div>

            </div>

          </div>
          {/* join button */}
          <button onClick={JoinMeet} className="font-bold  bg-green-500 h-12 w-40 rounded-lg shadow-lg   hover:cursor-pointer hover:bg-green-600 transition-colors duration-300">Join</button>
        </div>

      </div>
    </div>
  );
};

export default Lobby;
