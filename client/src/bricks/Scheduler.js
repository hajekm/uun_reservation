import React, {useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import {Form, Formik} from "formik";
import * as Yup from "yup";
import ReservationInput from "./ReservationInput";
import ReservationSelect from "./ReservationSelect";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {ReservationService} from "../Service";
import {Calendar} from "primereact/calendar";

function Scheduler() {
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [reservation, setReservation] = useState(null);
    const [createReservationDialog, setCreateReservationDialog] = useState(false);
    const [listReservationsCall, setListReservationsCall] = useState({
        state: "pending",
    });
    const [submitted, setSubmitted] = useState(false);
    const [startDate, setStartDate] = useState(null);

    useEffect(() => {
        ReservationService.getReservations().then(async (response) => {
            try {
                const responseJson = await response.json();
                switch (response.status) {
                    case 200: {
                        setListReservationsCall({state: "success"});
                        setReservations(responseJson);
                        break;
                    }
                    case 401: {
                        console.log(response);
                        setListReservationsCall({ state: "login" });
                        break;
                    }
                    default: {
                        console.log(response);
                        setListReservationsCall({ state: "error", error: responseJson.message });
                        break;
                    }
                }
            } catch (error) {
                setListReservationsCall({ state: "error", error: error.message });
            }
        });
    }, []);

    const handleDateClick = (date) => {
        let now = new Date();
        now.setHours(0,0,0,0);
        if (date < now) {
            setStartDate(now);
        } else {
            setStartDate(date);
        }
        setCreateReservationDialog(true);
    }

    const hideCreateReservationDialog = () => {
        setSubmitted(false);
        setCreateReservationDialog(false);
    };

    return (
    <div className="card m-3">
        <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            dateClick={(e) => handleDateClick(e.date)}
            events={[
                { title: 'event 1', start: '2023-12-01', end: '2023-12-04' },
                { title: 'event 2', date: '2023-12-02' }
            ]}
        />


    <Dialog
        visible={createReservationDialog}
        style={{width: "32rem"}}
        breakpoints={{"960px": "75vw", "641px": "90vw"}}
        header="Create reservation"
        modal
        className="p-fluid"
        onHide={hideCreateReservationDialog}
    >
        <Formik
            initialValues={{
            }}
            validationSchema={Yup.object({
                from: Yup.string()
                    .email("Invalid email address")
                    .required("Required field"),
                to: Yup.string()
                    .email("Invalid email address")
                    .required("Required field"),
                role: Yup.string()
                    .oneOf(["User", "Admin", "SuperUser"], "Unknown role")
                    .required("Required field"),
            })}
            onSubmit={(values, {setSubmitting}) => {
                setTimeout(() => {
                    // createUser(values);
                    setSubmitted(false);
                    setSubmitting(false);
                }, 500);
            }}
        >
            {(formik) => (
                <div className="flex card justify-content-center">
                    <Form className="flex flex-column gap-2">
                        <Calendar id="from" name="from" value={startDate} label="From" readOnlyInput showIcon minDate={new Date()}/>
                        <Calendar id="to" name="to" label="To" value={startDate} readOnlyInput showIcon minDate={new Date()}/>
                        <ReservationSelect id="room" name="room" label="Room"/>
                        <Button
                            type="submit"
                            severity="secondary"
                            icon={<FontAwesomeIcon icon={faSave} className="mr-1"/>}
                            label="Save"
                        />
                    </Form>
                </div>
            )}
        </Formik>
    </Dialog>
    </div>
);
}

export default Scheduler;