import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const MenuBar = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const navItems = [
    {
      id: 1,
      title: "Feedback",
      path: "feedback",
    },
    {
      id: 2,
      title: "How It Works",
      path: "how-it-works",
    },
    {
      id: 3,
      title: "FAQs",
      path: "faqs",
    },
    {
      id: 4,
      title: "Bug Report",
      path: "bug-report",
    },
    {
      id: 5,
      title: "Contact Us",
      path: "contact-us",
    },
  ];
  const handleClick = (id) => {
    if (id === active) return;
    setActive(id);
    navigate(navItems.find((item) => item.id === id).path);
  };
  return (
    <div className="hidden sm:block text-sm m-5 text-[#333333]">
      <ul className=" flex gap-10  items-center">
        {navItems.map((item, i) => (
          <li key={i} className="relative">
            <button
              onClick={() => handleClick(item.id)}
              className={`cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:bg-[#00CBA9] after:h-[2px] after:w-0 hover:after:w-full ${
                active === item.id ? "after:w-full" : "after:w-0"
              } after:duration-200`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuBar;
