import React from "react";
import Logo from "./Logo";
import MenuBar from "./MenuBar";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="h-12 px-5 shadow-sm flex justify-center md:justify-between items-center">
      <section className="md:self-auto">
        <Logo onClick={() => navigate("/")} />
      </section>
      <section className="hidden md:block">
        <MenuBar />
      </section>
    </div>
  );
};

export default Header;
