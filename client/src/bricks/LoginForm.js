import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ReservationService } from "../Service";
import ReservationInput from "./ReservationInput";
import * as Yup from "yup";
import { Form, Formik } from "formik";

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
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      modal
      onHide={() => setLoginDialog(false)}
    >
      <Formik
        initialValues={{}}
        validationSchema={Yup.object({
          email: Yup.string()
            .min(3, "Invalid email/username")
            .required("Required field"),
          password: Yup.string()
            .required("Required field")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            loginUser(values);
            setSubmitted(false);
            setSubmitting(false);
          }, 500);
        }}
      >
        {(formik) => (
          <div className="flex card justify-content-center">
            <Form className="flex flex-column gap-2">
              <div className="flex align-items-center justify-content-center">
                <div className="text-center mb-5">
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    className={"mt-3"}
                    size={"4x"}
                  />
                  <div className="text-900 text-3xl font-medium mb-3">
                    Welcome
                  </div>
                  <span className="text-600 font-medium line-height-3">
                    Don't have an account?
                  </span>
                  <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                    Create today!
                  </a>
                </div>

                <div>
                  <ReservationInput
                    id="email"
                    name="email"
                    label="Email/Username"
                  />
                  <ReservationInput
                    id="password"
                    name="password"
                    label="Password"
                  />

                  <div className="flex align-items-center justify-content-between mb-6">
                    <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                      Forgot your password?
                    </a>
                  </div>

                  <Button
                    label="Sign In"
                    icon="pi pi-user"
                    className="w-full"
                    onClick={loginUser}
                  />
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Dialog>
  );
}

export default LoginForm;
