import { use, useEffect, useState } from "react";
import Logo from "../components/Logo";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import useStore from "../store/store";
const JoinMeeting = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  // mode: "create" | "join" | "link"
  const mode = useStore((state) => state.FormMode);
  const setMode = useStore((state) => state.updateFormMode);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    meetingCode: "",
  });
  const [error, setError] = useState();

  const isCodeValid = (code) => {
    return true; // ask backend to check code validity
  };

  function generateMeetingCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const getPart = (length) => {
      let part = "";
      for (let i = 0; i < length; i++) {
        part += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return part;
    };
    const code = `${getPart(3)}-${getPart(3)}-${getPart(4)}`;
    if (isCodeValid(code)) {
      return code;
    } else {
      return generateMeetingCode();
    }
  }

  useEffect(() => {
    if (code) {
      if (!isCodeValid(code)) {
        navigate("/*");
        return;
      }
      setMode("link");
      setUserDetails((prev) => ({ ...prev, meetingCode: code }));
    }
  }, [code, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    //validate user name
    if (userDetails.name.length < 3 || userDetails.name.length > 20) {
      setError("Name must be between 3 and 20 characters.");
      return;
    }
    if (mode === "create") {
      setError("");
      // send meeting creation request here
      console.log("Creating meeting with:", userDetails);
      // after that update the meetId in store and navigate to lobby
    } else if (mode === "join" || mode === "link") {
      setError("");
      // send join meeting request here with userDetails..meetingCode
      console.log("Joining meeting with:", userDetails);
      // after that update the meetId in store and navigate to lobby
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-poppins px-4 bg-gray-50 sm:px-0">
      <div className="border-2 p-6 rounded-lg w-full max-w-md shadow-lg">
        {/* heading with logo*/}
        <h1 className="text-xl font-bold flex justify-center items-center gap-2">
          <Logo onClick={() => {}} height={50} />
        </h1>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 mt-6">
          {/* name */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Display Name"
              name="name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              required
              className="border-b focus:outline-green-600 py-2 pl-1"
            />
          </div>

          {/* email */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              required
              className="border-b focus:outline-green-600 py-2 pl-1"
            />
          </div>

          {/* Meeting Code */}
          {mode !== "link" && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Meeting Code"
                name="meetingCode"
                value={userDetails.meetingCode}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    meetingCode: e.target.value,
                  })
                }
                required
                disabled={mode === "create"} // disable typing in create mode
                className={`border-b focus:outline-green-600 flex-grow py-2 pl-1 ${
                  mode === "create" ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              />

              {mode === "create" && (
                <button
                  type="button"
                  onClick={() => {
                    const newCode = generateMeetingCode();
                    setUserDetails((prev) => ({
                      ...prev,
                      meetingCode: newCode,
                    }));
                  }}
                  className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                >
                  <FaKey color="white" />
                </button>
              )}
            </div>
          )}
          <div>
            {error && (
              <p className="text-red-500 text-sm before:content-['⚠️'] before:mr-1">
                {error}
              </p>
            )}
          </div>
          {/* Submit */}
          <div className="flex justify-center">
            <button className="bg-[#3E613E] text-white font-semibold p-2 rounded w-1/2 hover:bg-green-600">
              {mode === "create" ? "Create Meet" : "Join Meet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinMeeting;
