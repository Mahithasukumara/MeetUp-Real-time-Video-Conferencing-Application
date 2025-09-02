import { PiUsersThreeFill } from "react-icons/pi";
const Logo = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      className="ml-1 flex items-center gap-0.5 cursor-pointer"
    >
      <span className="">
        <PiUsersThreeFill className=" text-green-900 border-green-900 text-[44px] rounded-md p-1" />
      </span>
      <span className="text-green-900 text-xl font-bold font-poppins"></span>
    </span>
  );
};

export default Logo;
