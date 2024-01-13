import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBed, faBook, faCalendarDay, faHome, faMoon, faSun, faUser} from "@fortawesome/free-solid-svg-icons";
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
import {Tag} from "primereact/tag";

const items = [
    {
        label: "Home",
        icon: <FontAwesomeIcon className={"mr-3"} icon={faHome}/>,
        url: "/",
    },
    {
        label: "Rooms",
        icon: <FontAwesomeIcon className={"mr-3"} icon={faBed}/>,
        url: "/rooms",
    },
    {
        label: "Users",
        icon: <FontAwesomeIcon className={"mr-3"} icon={faUser}/>,
        url: "/users",
    },
    {
        label: "AuditLog",
        icon: <FontAwesomeIcon className={"mr-3"} icon={faBook}/>,
        url: "/auditLog",
    },
    {
        label: "Reservations",
        icon: <FontAwesomeIcon className={"mr-3"} icon={faCalendarDay}/>,
        url: "/reservations",
    },
];

function Header() {
    const [checked, setChecked] = useState(false)
    const [user, setUser] = useState(null)
    const {changeTheme} = useTheme();
    const [menuItems, setMenuItems] = useState(items)
    const cookies = new Cookies();




    useEffect(() => {
        const themeCookie = cookies.get('dark-theme');
        if (!themeCookie) {
            cookies.set('dark-theme', checked, {path: '/'});
        } else {
            setChecked(themeCookie)
        }
        changeTheme(checked ? "bootstrap4-dark-blue" : "bootstrap4-light-blue");

        ReservationService.getUserInfo().then(async (response) => {
            try {
                const resJson = await response.json();
                if (response.ok) {
                    setUser(resJson);
                    let _items = menuItems;
                    for (let i = 1; i < _items.length; i++) {
                        _items[i].visible = resJson.UserRole.id > 2;
                    }
                    setMenuItems(_items)
                }
            } catch (error) {
                console.log(error);
            }
        });

    }, []);

    const start = (
        <Link className="mr-8" to="/">
            <FontAwesomeIcon size={"3x"} icon={faBook}/>
        </Link>
    );

    const end = () => {
        if (user) {
            return (
                <div>
                    <ToggleButton className={"mr-3"} onIcon={<FontAwesomeIcon icon={faMoon}/>}
                                  offIcon={<FontAwesomeIcon icon={faSun}/>}
                                  checked={checked} onLabel="" offLabel="" onChange={(e) => {
                        cookies.set('dark-theme', !checked, {path: '/'});
                        setChecked(!checked);
                        changeTheme(checked ? "bootstrap4-light-blue" : "bootstrap4-dark-blue");
                    }}/>
                    <Tag className="mr-2" icon={<FontAwesomeIcon className="mr-1" icon={faUser}/>}
                         value={user.email}></Tag>
                </div>
            )
        }
        return (
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
                        window.location.href = '/api/auth';
                    }}
                />


            </div>
        )
    };

    return (
        <div className="App">
            <Menubar title="Reservation" model={menuItems} start={start} end={end}/>
            <Outlet/>
        </div>
    );
}

export default Header;
