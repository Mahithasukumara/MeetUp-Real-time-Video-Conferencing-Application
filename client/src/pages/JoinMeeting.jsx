import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";
import useStore from "../store/store.js";
import socketPromise from "../utiles/socketPromise.js";

const JoinMeeting = () => {
  const { meetId } = useParams();
  const navigate = useNavigate();
  // mode: "create" | "join" | "link"
  const socket = useStore((state) => state.Socket);
  const mode = useStore((state) => state.FormMode);
  const setMode = useStore((state) => state.updateFormMode);
  const setUser = useStore((state) => state.setUser);
  const setMeetId = useStore((state) => state.setMeetId);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    meetId: "",
  });
  const [error, setError] = useState();

  const isCodeValid = async (code) => {
    try {
      const { FormMode } = useStore.getState();
      const { success } = await socketPromise(socket, "is_valid_code", {
        meetId: code,
        isCreateMode: FormMode === "create",
      });
      if (success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
      return false;
    }
  };

  async function generateMeetingCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const getPart = (length) => {
      let part = "";
      for (let i = 0; i < length; i++) {
        part += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return part;
    };
    const code = `${getPart(4)}-${getPart(3)}-${getPart(3)}`;
    const isValid = await isCodeValid(code);
    if (isValid) {
      return code;
    } else {
      return generateMeetingCode();
    }
  }

  useEffect(() => {
    async function checkMeetId() {
      if (!meetId) return;
      setMode("link");
      const isValid = await isCodeValid(meetId);
      if (!isValid) {
        navigate("/*");
        return;
      }

      setUserDetails((prev) => ({ ...prev, meetId }));
    }

    checkMeetId();
  }, [meetId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validate user name
    if (userDetails.name.length < 3 || userDetails.name.length > 100) {
      setError("Name must be between 3 and 100 characters.");
      return;
    }
    if (mode === "create") {
      const isValid = await isCodeValid(userDetails.meetId);
      if (!isValid) {
        setError("invalid meet id");
        return;
      }
      setError("");
      try {
        const { user, success } = await socketPromise(
          socket,
          "new_meet",
          userDetails
        );
        setUser({ ...user });
        setMeetId(user.meetId);

        if (success) {
          console.log("Creating meeting with:", userDetails);
          navigate("/lobby");
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    } else if (mode === "link") {
      try {
        setError("");
        const { user, success } = await socketPromise(
          socket,
          "join_meet",
          userDetails
        );
        setUser({ ...user });
        setMeetId(user.meetId);

        if (success) {
          console.log("joining meeting with:", userDetails);
          navigate("/lobby");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (mode === "join") {
      try {
        if (!userDetails.meetId) {
          setError("Meeting code is required.");
          return;
        }
        const isValid = await isCodeValid(userDetails.meetId);
        if (!isValid) {
          return;
        }
        setError("");
        const { user, success } = await socketPromise(
          socket,
          "join_meet",
          userDetails
        );
        setUser({ ...user });
        setMeetId(user.meetId);
        if (success) {
          navigate("/lobby");
        }
      } catch (error) {
        console.log(error);
      }
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
                value={userDetails.meetId}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    meetId: e.target.value,
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
                  onClick={async () => {
                    const newCode = await generateMeetingCode();
                    setUserDetails((prev) => ({
                      ...prev,
                      meetId: newCode,
                    }));
                  }}
                  className="bg-green-500  text-white px-3 py-2 rounded hover:bg-green-600"
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
