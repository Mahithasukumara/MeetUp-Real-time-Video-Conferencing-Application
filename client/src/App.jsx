import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import io from "socket.io-client";
import { useEffect } from "react";
import useStore from "./store/store.js";
import {
  BugReport,
  ContactUs,
  FAQs,
  FeedBack,
  Home,
  HowItWorks,
  JoinMeeting,
  Lobby,
  Meeting,
} from "./pages/index.js";
function App() {
  const setSocket = useStore((state) => state.setSocket);

  useEffect(() => {
    const socket = io.connect(import.meta.env.VITE_SERVER_URL);
    setSocket(socket);
    socket.emit("health_check", ({ status }) =>
      console.log("health status: ", status)
    );
  }, [setSocket]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="feedback" element={<FeedBack />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="bug-report" element={<BugReport />} />
          <Route path="contact-us" element={<ContactUs />} />
        </Route>

        <Route path="/lobby" element={<Lobby />} />
        <Route path="/join-meeting/:meetId?" element={<JoinMeeting />} />
        <Route path="/meeting" element={<Meeting />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
