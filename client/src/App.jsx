import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
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
        <Route path="/join-meeting" element={<JoinMeeting />} />
        <Route path="/meeting" element={<Meeting />} />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
