import React, { useEffect, useState } from "react";
import useStoreStore from "../store/store";
import useControlBarStore from "../store/controlBarStore";
import useMeetStore from "../store/meetStore.js";
import useIcons from "../constants/Icons.jsx";
import VideoTile from "../components/VideoTile.jsx";
import { FiUsers } from "react-icons/fi";
import { IoChatboxOutline } from "react-icons/io5";
import { LuUserCheck } from "react-icons/lu";
import Participants from "../components/Participants.jsx";
import { MdOutlineClose } from "react-icons/md";
import Chat from "../components/Chat.jsx";
const Meeting = () => {
  const icons = useIcons();
  const socket = useStoreStore((state) => state.Socket);
  const MeetMode = useMeetStore((state) => state.MeetMode);
  const device = useStoreStore((state) => state.Device);
  const addParticipant = useMeetStore((state) => state.addParticipant);
  const isParticipantPanelOpen = useControlBarStore(
    (state) => state.isParticipantPanelOpen
  );
  const ToggleParticipantPanel = useControlBarStore(
    (state) => state.ToggleParticipantPanel
  );
  const Transports = useMeetStore((state) => state.Transports);
  const addConsumerIdToParticipant = useMeetStore(
    (state) => state.addConsumerIdToParticipant
  );
  const removeConsumer = useMeetStore((state) => state.removeConsumer);
  const removeConsumerIdFromParticipant = useMeetStore(
    (state) => state.removeConsumerIdFromParticipant
  );
  const addConsumer = useMeetStore((state) => state.addConsumer);
  const ToggleSideBar = useControlBarStore((state) => state.ToggleSideBar);
  const MeetId = useStoreStore((state) => state.MeetId);
  const isSideBarOpen = useControlBarStore((state) => state.isSideBarOpen);
  const tilesPerPage = isSideBarOpen ? 9 : 12;
  const [sideBarMode, setSideBarMode] = useState("participants");
  const getVideoTileHeight = (noOfTiles) => {
    if (tilesPerPage == 12) {
      if (noOfTiles == 1) return "h-110";
      if (noOfTiles == 2) return "h-85";
      if (noOfTiles > 2 && noOfTiles <= 6) return "h-53";
      if (noOfTiles > 6 && noOfTiles <= 12) return "h-36";
    } else {
      if (noOfTiles == 1) return "h-110";
      if (noOfTiles == 2) return "h-65";
      if (noOfTiles > 2 && noOfTiles <= 4) return "h-55";
      if (noOfTiles > 4 && noOfTiles <= 6) return "h-40";
      if (noOfTiles > 6 && noOfTiles <= 9) return "h-35";
    }
  };
  const getAllParticipentsList = async () => {
    socket.emit("participants_list", { MeetId }, ({ participantsList }) => {
      if (!participantsList || participantsList.length == 0) return;
      for (const participant of participantsList) {
        const { name, email, socketId, meetId } = participant;
        addParticipant({ name, email, socketId });
      }
    });
  };

  const consumeAllProducers = async () => {
    socket.emit(
      "consume_media",
      {
        MeetId,
        rtpCapabilities: device.routerRtpCapabilities,
        transportId: Transports.receiveTransport?.id,
      },
      async ({ consumerSet }) => {
        for (const {
          producerId,
          consumerId,
          kind,
          rtpParameters,
          appData,
        } of consumerSet) {
          const consumer = await Transports.receiveTransport.consume({
            id: consumerId,
            producerId,
            kind,
            rtpParameters,
            appData,
          });

          const { producerPeerId } = appData;
          consumer.on("transportclose", () => {
            consumer.close();
          });
          consumer.on("producerclose", () => {
            consumer.close();
          });
          consumer.on("close", () => {
            removeConsumerIdFromParticipant({
              socketId: producerPeerId,
              consumerId: consumer.id,
            });
            removeConsumer({ consumerId: consumer.id });
          });
          addConsumerIdToParticipant({
            socketId: producerPeerId,
            consumerId: consumer.id,
          });

          addConsumer({ consumerId: consumer.id, consumer });
        }
      }
    );
  };

  const consumeByProducerId = async ({ producerId }) => {
    socket.emit(
      "consume_new_producer",
      {
        MeetId,
        transportId: Transports.receiveTransport.id,
        producerId,
        rtpCapabilities: device.routerRtpCapabilities,
      },
      async ({ consumer }) => {
        const { producerId, consumerId, kind, rtpParameters, addData } =
          consumer;
        const newConsumer = await Transports.receiveTransport.consume({
          id: consumerId,
          producerId,
          kind,
          rtpParameters,
          addData,
        });
        const { producerPeerId } = appData;

        newConsumer.on("transportclose", () => {
          newConsumer.close();
        });
        newConsumer.on("producerclose", () => {
          newConsumer.close();
        });
        newConsumer.on("close", () => {
          removeConsumerIdFromParticipant({
            socketId: producerPeerId,
            consumerId: newConsumer.id,
          });
          removeConsumer({ consumerId: newConsumer.id });
        });

        addConsumerIdToParticipant({
          socketId: producerPeerId,
          consumerId: consumer.id,
        });

        addConsumer({ consumerId: consumer.id, consumer });
      }
    );
  };
  useEffect(() => {}, []);
  return (
    <div className="grid grid-cols-12 bg-[#18230F] text-[#E1EEBC]">
      <div
        className={`${
          isSideBarOpen ? "col-span-9" : "col-span-12"
        } col-span-9 h-screen flex flex-col rounded gap-1`}
      >
        <section className="flex-grow p-1 rounded-xl h-full">
          <div className="block md:hidden">mobile</div>
          <div className="hidden md:block lg:hidden ">tablet</div>
          <div className="hidden lg:block h-full">
            <div className=" flex flex-col h-full gap-2 m-1">
              {/* video gallery */}

              <section className="flex-grow border p-2">
                {MeetMode === "gallery" ? (
                  <div className="border p-1 h-full flex justify-center items-center flex-wrap content-center gap-2">
                    <VideoTile className="h-85" />
                  </div>
                ) : (
                  <div className="flex flex-col h-full  gap-1">
                    <section className="border flex-grow rounded-lg p-3">
                      primary section
                    </section>
                    {isParticipantPanelOpen && (
                      <section className="p-1">
                        <div className="h-full carousel justify-start">
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                          <VideoTile className="h-30 card shadow-[0_4px_20px_rgba(0,0,0,0.6)]" />
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </section>
              {/* control bar */}
              <section className="h-12 border px-2 grid grid-cols-3 gap-2 items-center rounded-lg sha">
                <div className="col-span-1 flex gap-15 items-center">
                  <span>Meet Id : {MeetId ? `${MeetId}` : "XXX-XXX-XXXX"}</span>
                  {MeetMode === "present" && (
                    <span>
                      <button
                        datacontent="Show/Hide Participants"
                        onClick={() => ToggleParticipantPanel()}
                        className={`flex relative items-center justify-center border p-1 rounded-lg hover:before:block hover:after:block cursor-pointer before:absolute before:hidden after:hidden
                    before:content-[attr(datacontent)] before:bg-black before:text-sm before:bottom-13 before:p-0.5 before:rounded-lg
                    after:content-[] after:absolute after:border-l-4 after:border-r-4 after:border-t-5 after:border-transparent after:border-t-black after:bottom-[48px]`}
                      >
                        <LuUserCheck className="h-9 w-9" />
                      </button>
                    </span>
                  )}
                </div>
                <div className="col-span-1 flex justify-center items-center gap-3">
                  {icons.slice(0, 4).map((item, ind) => (
                    <button
                      key={ind}
                      datacontent={item.name}
                      disabled={item.disable || false}
                      onClick={() => item.onClick()}
                      className={`flex relative items-center justify-center border p-1 rounded-lg hover:before:block hover:after:block cursor-pointer before:absolute before:hidden after:hidden
                    before:content-[attr(datacontent)] before:p-1 before:bg-black before:text-sm before:bottom-13 before:rounded-lg
                    after:content-[''] after:absolute after:border-l-4 after:border-r-4 after:border-t-5 after:border-transparent after:border-t-black after:bottom-[48px]`}
                    >
                      {item.isEnabled ? item.onIcon : item.offIcon}
                    </button>
                  ))}
                </div>
                <div className="col-span-1 flex gap-3 items-center justify-center">
                  {icons.slice(4, 7).map((item, ind) => (
                    <button
                      key={ind}
                      datacontent={item.name}
                      disabled={item.disable || false}
                      onClick={() => item.onClick()}
                      className={`flex relative  items-center justify-center border p-1 rounded-lg hover:before:block hover:after:block cursor-pointer before:absolute before:hidden after:hidden
                    before:content-[attr(datacontent)] before:bg-black before:text-sm before:bottom-13 before:p-0.5 before:rounded-lg
                    after:content-[] after:absolute after:border-l-4 after:border-r-4 after:border-t-5 after:border-transparent after:border-t-black after:bottom-[48px]`}
                    >
                      {item.isEnabled ? item.onIcon : item.offIcon}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
      {isSideBarOpen && (
        <div className="col-span-3">
          <div className=" h-full border flex flex-col flex-2/3 p-1.5 rounded-lg gap-1">
            <header className="border rounded-sm h-8 grid grid-cols-12 items-center gap-1">
              <div
                className="col-span-5 border-r-1  cursor-pointer flex justify-center items-center"
                onClick={() =>
                  sideBarMode === "participants"
                    ? null
                    : setSideBarMode("participants")
                }
              >
                <FiUsers className="h-7 w-7 p-1" />
              </div>
              <div
                className="col-span-5  border-r-1  cursor-pointer flex justify-center items-center"
                onClick={() =>
                  sideBarMode === "chat" ? null : setSideBarMode("chat")
                }
              >
                <IoChatboxOutline className="h-7 w-7 p-1" />
              </div>
              <div
                className="col-span-2 border-r-1  cursor-pointer flex justify-center items-center"
                onClick={() => {
                  ToggleSideBar();
                }}
              >
                <MdOutlineClose className="h-7 w-7 p-1" />
              </div>
            </header>
            <section className="h-full border-amber-900 flex-grow border">
              {sideBarMode === "participants" ? (
                <div className="h-full border p-1 rounded">
                  <Participants />
                </div>
              ) : (
                <div className="h-full border p-1 rounded flex flex-col">
                  <Chat />
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meeting;
