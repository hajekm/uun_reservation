import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUser, faBed, faSun, faMoon, faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { Link, Outlet } from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Button} from "primereact/button";
import {ToggleButton} from "primereact/togglebutton";
import {useTheme} from "../bricks/ThemeProvider";

function Header() {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Freservations.echovo.cz%2Fauth%2Fcallback&scope=profile%20email&client_id=657224920436-sk7p2u3drrib3drg2ni29t1atggi90nf.apps.googleusercontent.com";
    const [checked, setChecked] = useState(false)
    const { changeTheme } = useTheme();


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
        {
            label: "Reservations",
            icon: <FontAwesomeIcon className={"mr-3"} icon={faCalendarDay} />,
            url: "/scheduler",
        },
  ];
  const start = (
    <Link className="mr-8" to="/">
      <FontAwesomeIcon size={"3x"} icon={faBook} />
    </Link>
  );

  const end = () => (
      <div>

          <ToggleButton className={"mr-3"} onIcon={<FontAwesomeIcon icon={faMoon} />} offIcon={<FontAwesomeIcon  icon={faSun} />}
                        checked={checked} onLabel="" offLabel="" onChange={(e) => {setChecked(!checked);changeTheme(checked? "bootstrap4-light-blue": "bootstrap4-dark-blue");}}/>
        <Button
            icon={<FontAwesomeIcon icon={faGoogle} className="mr-1" />}
            label="Sign in"
            onClick={(e) => {

                window.location.href = googleAuthUrl;
            }}
        />
      </div>
  );

  return (
    <div className="App">
      <Menubar title="Reservation" model={items} start={start} end={end}/>
      <Outlet />
    </div>
  );
}
export default Header;
