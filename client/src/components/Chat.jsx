import React, { use, useEffect, useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import SendBubble from "./SendBubble";
import ReceiveBubble from "./ReceiveBubble";
import useStoreStore from "../store/store.js";
import socketPromise from "../utiles/socketPromise.js";
const Chat = () => {
  const [messages, setMessages] = useState([
    { type: "send", msg: "hello", to: "", time: "10:00 AM" },
    {
      type: "receive",
      msg: "hii",
      from: "name",
      time: "10:01 AM",
    },
    { type: "send", msg: "how are you?", to: "everyone", time: "10:02 AM" },
  ]);
  const socket = useStoreStore((state) => state.socket);
  const [msg, setMsg] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    if (msg.trim() === "") return;
    const newMessage = {
      type: "send",
      msg: msg,
      to: "everyone",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const { success } = await socketPromise(socket, "new_message", newMessage);
    if (success) {
      console.log("Message not sent");
      return;
    }
    setMessages([...messages, newMessage]);

    setMsg("");
  };
  const handleNewMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };
  useEffect(() => {
    if (!socket) return;
    socket.on("new_message", handleNewMessage);

    return () => socket.off("new_message", handleNewMessage);
  }, [socket]);
  return (
    <div className="h-full flex flex-col gap-1">
      <div className="flex-grow overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            No messages yet
          </div>
        ) : (
          <div className="h-[420px] p-1 flex flex-col  overflow-y-auto">
            {messages.map((message, index) => {
              if (message.type === "send") {
                return (
                  <SendBubble
                    key={index}
                    msg={message.msg}
                    time={message.time}
                  />
                );
              } else {
                return (
                  <ReceiveBubble
                    key={index}
                    msg={message.msg}
                    from={message.from}
                    time={message.time}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
      <div className="">
        <div></div>
        <div>
          <div className="flex p-1 gap-3">
            <button className="border rounded px-1">Send to </button>
            <select name="to" id="to" className="border rounded text-sm">
              <option value="Everyone">Everyone</option>
            </select>
          </div>
          <form
            className="flex p-1 gap-2 h-10"
            onSubmit={(e) => sendMessage(e)}
          >
            <input
              className="border rounded flex-grow pl-2"
              type="text"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              placeholder="Enter message to send"
            />
            <button>
              <BiSolidSend
                type="submit"
                className="h-8 w-8 cursor-pointer border p-0.5 rounded-md"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
