import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faBook,
  faCalendarDay,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { Link, Outlet } from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { useTheme } from "../bricks/ThemeProvider";
import { ReservationService } from "../Service";
import Cookies from "universal-cookie";

function Header() {
  const googleAuthUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Freservations.echovo.cz%2Fauth%2Fcallback&scope=profile%20email&client_id=657224920436-sk7p2u3drrib3drg2ni29t1atggi90nf.apps.googleusercontent.com";
  const [checked, setChecked] = useState(false);
  const { changeTheme } = useTheme();
  const cookies = new Cookies();

  const items = [
    {
      label: "Reservations",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faCalendarDay} />,
      url: "/",
    },
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
    {
      label: "AuditLog",
      icon: <FontAwesomeIcon className={"mr-3"} icon={faBook} />,
      url: "/auditLog",
    },
  ];

  useEffect(() => {
    const themeCookie = cookies.get("dark-theme");
    if (!themeCookie) {
      cookies.set("dark-theme", checked, { path: "/" });
    } else {
      setChecked(themeCookie);
    }
    changeTheme(checked ? "bootstrap4-dark-blue" : "bootstrap4-light-blue");
  });

  const start = (
    <Link className="mr-8" to="/">
      <FontAwesomeIcon size={"3x"} icon={faBook} />
    </Link>
  );

  const end = () => (
    <div>
      <ToggleButton
        className={"mr-3"}
        onIcon={<FontAwesomeIcon icon={faMoon} />}
        offIcon={<FontAwesomeIcon icon={faSun} />}
        checked={checked}
        onLabel=""
        offLabel=""
        onChange={(e) => {
          cookies.set("dark-theme", !checked, { path: "/" });
          setChecked(!checked);
          changeTheme(
            checked ? "bootstrap4-light-blue" : "bootstrap4-dark-blue"
          );
        }}
      />
      <Button
        icon={<FontAwesomeIcon icon={faGoogle} className="mr-1" />}
        label="Sign in"
        onClick={(e) => {
          ReservationService.getAuth().then(async (response) => {
            const responseJson = await response.json();
            console.log(responseJson);
          });
          // window.location.href = googleAuthUrl;
        }}
      />
    </div>
  );

  return (
    <div className="App">
      <Menubar title="Reservation" model={items} start={start} end={end} />
      <Outlet />
    </div>
  );
}

export default Header;
