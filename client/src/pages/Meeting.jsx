import React, { useState } from "react";
import useStore from "../store/store";
const Meeting = () => {
  const MeetMode = useStore((state) => state.MeetMode);
  return (
    <div>
      {/* section header */}
      <section>Header</section>
      {/* video Gallery */}

      {/* control bar  */}
      <section>Video Bar</section>
    </div>
  );
};

export default Meeting;
