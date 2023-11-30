import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUser, faBed } from "@fortawesome/free-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { Link, Outlet } from "react-router-dom";
import "primereact/resources/themes/saga-orange/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

function Header() {
  const items = [
    {
      label: "Users",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faUser} />,
      url: "/users",
    },
    {
      label: "Rooms",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faBed} />,
      url: "/rooms",
    },
  ];
  const start = (
    <Link className="mr-8" to="/">
      <FontAwesomeIcon size={"3x"} icon={faBook} />
    </Link>
  );

  return (
    <div className="App">
      <Menubar title="Reservation" model={items} start={start} />
      <Outlet />
    </div>
  );
}
export default Header;
