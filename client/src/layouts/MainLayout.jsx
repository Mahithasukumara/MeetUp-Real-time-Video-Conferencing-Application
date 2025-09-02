import { Outlet } from "react-router-dom";
import Header from "../components/Header";
const MainLayout = () => {
  return (
    <div className="rounded-md bg-[#FAF7F3]">
      <Header />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
