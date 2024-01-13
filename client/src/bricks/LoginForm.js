import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

function LoginForm() {
    const [loginDialog, setLoginDialog] = useState(true);

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
                        <FontAwesomeIcon icon={faDoorOpen} className={"m-3"} size={"4x"}/>
                        <div className="text-900 text-3xl font-medium mb-3">
                            Welcome to the reservation system. Please log in first.
                        </div>
                        <Button
                            label="Sign In"
                            icon={<FontAwesomeIcon icon={faGoogle} className="mr-1"/>}
                            className="w-full"
                            onClick={() => window.location.href = '/auth'}
                        />
                    </div>

                    <div>

                    </div>
                </div>
            </div>
        </Dialog>
    );
}

export default LoginForm;
