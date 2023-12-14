import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPoo } from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="flex grid m-5 justify-content-center grid">
      <div className="col-12">
        <h1>Welcome to reservation</h1>
        {/* <FontAwesomeIcon size={"3x"} icon={faPoo} /> */}
      </div>
    </div>
  );
}

export default Home;
