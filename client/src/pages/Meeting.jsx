import React, { useState } from "react";
import useStoreStore from "../store/store";
import useControlBarStore from "../store/controlBarStore";
import useMeetStore from "../store/meetStore.js";
import useIcons from "../constants/Icons.jsx";
import VideoTile from "../components/VideoTile.jsx";
import {
  HiOutlineVideoCamera,
  HiOutlineVideoCameraSlash,
} from "react-icons/hi2";
import { LuUserCheck } from "react-icons/lu";
const Meeting = () => {
  const icons = useIcons();
  const MeetMode = useMeetStore((state) => state.MeetMode);
  const isParticipentPanelOpen = useControlBarStore(
    (state) => state.isParticipentPanelOpen
  );
  const ToggleParticipentPanel = useControlBarStore(
    (state) => state.ToggleParticipentPanel
  );
  const MeetId = useStoreStore((state) => state.MeetId);
  const isSideBarOpen = useControlBarStore((state) => state.isSideBarOpen);
  const tilesPerPage = isSideBarOpen ? 9 : 12;

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
  return (
    <div className="grid grid-cols-12 bg-[#18230F] text-[#E1EEBC]">
      <div
        className={`${
          isSideBarOpen ? "col-span-9" : "col-span-12"
        } col-span-9 h-screen flex flex-col rounded gap-1`}
      >
        <section className="flex-grow p-1 rounded-xl h-full">
          <div className="block md:hidden">mobile</div>
          <div className="hidden md:block lg:hidden ">tablet </div>
          <div className="hidden lg:block h-full">
            <div className=" flex flex-col h-full gap-2 m-1">
              {/* video gallery */}

              <section className="flex-grow border p-2">
                {MeetMode === "gallery" ? (
                  <div className="border p-1 h-full flex justify-center items-center flex-wrap content-center gap-2">
                    {/* <VideoTile
                    className={`${() => getVideoTileHeight(noOfTiles)}`}
                  /> */}
                    <VideoTile className="h-20" />
                  </div>
                ) : (
                  <div className="flex flex-col h-full  gap-1">
                    <section className="border flex-grow rounded-lg p-3">
                      primary section
                    </section>
                    {isParticipentPanelOpen && (
                      <section className=" p-1">
                        <div className="h-full carousel justify-start">
                          <VideoTile className="h-30 card" />
                          <VideoTile className="h-30 card" />
                          <VideoTile className="h-30 card" />
                          <VideoTile className="h-30 card" />
                          <VideoTile className="h-30 card" />
                          <VideoTile className="h-30 card" />
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
                        onClick={() => ToggleParticipentPanel()}
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
                      className={`flex relative items-center justify-center border p-1 rounded-lg hover:before:block hover:after:block cursor-pointer before:absolute before:hidden after:hidden
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
      {isSideBarOpen && <aside className="col-span-3">this is side bar</aside>}
    </div>
  );
};

export default Meeting;
