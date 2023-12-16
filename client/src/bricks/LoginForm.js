import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {ReservationService} from "../Service";

function LoginForm(props) {
    const [loginDialog, setLoginDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        console.log(props.login + " WTF LOGIN");
        setLoginDialog(props.login);
    }, []);

    const loginUser = (values) => {
        setSubmitted(true);
        ReservationService.loginUser(values).then((res) => {
            if (res.ok) {
                toast.current.show({
                    severity: "success",
                    summary: "OK",
                    detail: `User ${values.email} has been Loged!`,
                    life: 3000,
                });
            } else {
                console.log(res);
                toast.current.show({
                    severity: "warning",
                    summary: "Error",
                    detail: `User ${values.email} is not loged!`,
                    life: 3000,
                });
            }
        });
        setLoginDialog(false);
    };

    return (
        <Dialog
            visible={loginDialog}
            style={{width: "32rem"}}
            breakpoints={{"960px": "75vw", "641px": "90vw"}}
            modal
            onHide={() => setLoginDialog(false)}
        >
            <div className="flex card justify-content-center">
                <div className="flex align-items-center justify-content-center">
                    <div className="text-center mb-5">
                        <FontAwesomeIcon icon={faDoorOpen} className={"mt-3"} size={"4x"}/>
                        <div className="text-900 text-3xl font-medium mb-3">
                            Welcome to reservation
                        </div>
                    </div>

                    <div>
                        <Button
                            label="Sign In"
                            icon={<FontAwesomeIcon icon={faGoogle} className="mr-1"/>}
                            className="w-full"
                            onClick={loginUser}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default LoginForm;
