import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBed, faBook, faCalendarDay, faMoon, faSun, faUser, faHome} from "@fortawesome/free-solid-svg-icons";
import {Menubar} from "primereact/menubar";
import {Link, Outlet} from "react-router-dom";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Button} from "primereact/button";
import {ToggleButton} from "primereact/togglebutton";
import {useTheme} from "../bricks/ThemeProvider";
import {ReservationService} from "../Service";
import Cookies from 'universal-cookie';

function Header() {
    const [checked, setChecked] = useState(false)
    const {changeTheme} = useTheme();
    const cookies = new Cookies();


    const items = [
        {
            label: "",
            icon: <FontAwesomeIcon className={"mr-3"} icon={faHome}/>,
            url: "/",
        },
        {
            label: "Users",
            icon: <FontAwesomeIcon className={"mr-3"} icon={faUser}/>,
            url: "/users",
        },
        {
            label: "Rooms",
            icon: <FontAwesomeIcon className={"mr-3"} icon={faBed}/>,
            url: "/rooms",
        },
        {
            label: "Reservations",
            icon: <FontAwesomeIcon className={"mr-3"} icon={faCalendarDay}/>,
            url: "/reservations",
        },
    ];

    useEffect(() => {
        const themeCookie = cookies.get('dark-theme');
        if (!themeCookie) {
            cookies.set('dark-theme', checked, {path: '/'});
        } else {
            setChecked(themeCookie)
        }
        changeTheme(checked ? "bootstrap4-dark-blue" : "bootstrap4-light-blue");
    });

    const start = (
        <Link className="mr-8" to="/">
            <FontAwesomeIcon size={"3x"} icon={faBook}/>
        </Link>
    );

    const end = () => (
        <div>

            <ToggleButton className={"mr-3"} onIcon={<FontAwesomeIcon icon={faMoon}/>}
                          offIcon={<FontAwesomeIcon icon={faSun}/>}
                          checked={checked} onLabel="" offLabel="" onChange={(e) => {
                cookies.set('dark-theme', !checked, {path: '/'});
                setChecked(!checked);
                changeTheme(checked ? "bootstrap4-light-blue" : "bootstrap4-dark-blue");
            }}/>
            <Button
                icon={<FontAwesomeIcon icon={faGoogle} className="mr-1"/>}
                label="Sign in"
                onClick={(e) => {
                    window.location.href = 'http://localhost:3001/auth';
                }}
            />
        </div>
    );

    return (
        <div className="App">
            <Menubar title="Reservation" model={items} start={start} end={end}/>
            <Outlet/>
        </div>
    );
}

export default Header;
