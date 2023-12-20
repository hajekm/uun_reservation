import React, {useEffect, useRef, useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {Form, Formik} from "formik";
import * as Yup from "yup";
import ReservationSelect from "./ReservationSelect";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import {ReservationService} from "../Service";
import ReservationCalendar from "./ReservationCalendar";
import {Toast} from "primereact/toast";
import ErrorResponse from "./ErrorResponse";
import Progress from "./Progress";
import ReservationInput from "./ReservationInput";
import LoginForm from "./LoginForm";

function Scheduler() {
    const [rooms, setRooms] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [events, setEvents] = useState([]);
    const [reservation, setReservation] = useState(null);
    const [createReservationDialog, setCreateReservationDialog] = useState(false);
    const [listReservationsCall, setListReservationsCall] = useState({
        state: "pending",
    });
    const [submitted, setSubmitted] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        ReservationService.getReservations().then(async (response) => {
            try {
                const responseJson = await response.json();
                switch (response.status) {
                    case 200: {
                        setListReservationsCall({state: "success"});
                        setReservations(responseJson);
                        const _events = responseJson.map(r => ({
                            id: r.id,
                            title: "Room id: " + r.room_id,
                            start: r.start_date,
                            end: r.end_date,
                            color: r.end_date < startDate ? "#A7C7E7" : getEventColor(r.state_id),
                        }));
                        setEvents(_events);
                        break;
                    }
                    case 401: {
                        console.log(response);
                        setListReservationsCall({state: "login"});
                        break;
                    }
                    default: {
                        console.log(response);
                        setListReservationsCall({state: "error", error: responseJson.message});
                        break;
                    }
                }
            } catch (error) {
                setListReservationsCall({state: "error", error: error.message});
            }
        });
    }, []);

    const getDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const getEventColor = (state) => {
        switch (state) {
            case 2: {
                return "#FF0000"
            }
            case 3: {
                return "#FF964F"
            }
            default: {
                return "#77DD77"
            }
        }
    }

    const createReservation = (values) => {
        setSubmitted(true);
        values.start_date = getDateString(values.start_date);
        values.end_date = getDateString(values.end_date);
        ReservationService.postReservation(values).then(async (response) => {
            const responseJson = await response.json();
            if (response.ok) {
                let _reservations = [...reservations];
                _reservations.push(responseJson);
                setReservations(_reservations);
                toast.current.show({
                    severity: "success",
                    summary: "Úspěch",
                    detail: `Rezervace ${responseJson.id} byla přidána`,
                    life: 3000,
                });
            } else {
                console.log(response);
                toast.current.show({
                    severity: "danger",
                    summary: "Chyba",
                    detail: `Něco se pokazilo ${responseJson.message}`,
                    life: 3000,
                });
            }
        });

        setCreateReservationDialog(false);

    };

    const handleDateClick = (date) => {
        ReservationService.getRooms().then(async (response) => {
            try {
                const responseJson = await response.json();
                if (response.ok) {
                    setRooms(responseJson);
                    let now = new Date();
                    now.setHours(0, 0, 0, 0);
                    if (date < now) {
                        setStartDate(now);
                    } else {
                        setStartDate(date);
                    }
                    setCreateReservationDialog(true);
                }
            } catch (error) {
                toast.current.show({
                    severity: "danger",
                    summary: "Error",
                    detail: `Cannot fetch rooms`,
                    life: 3000,
                });
            }
        });
    }

    const hideCreateReservationDialog = () => {
        setSubmitted(false);
        setCreateReservationDialog(false);
    };
    switch (listReservationsCall.state) {
        case "success":
            return (
                <div className="card m-3">
                    <Toast ref={toast}/>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, resourceTimelinePlugin]}
                        initialView="dayGridMonth"
                        dateClick={(e) => handleDateClick(e.date)}
                        schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                        events={events}
                        eventClick={(e) => console.log(e.event)}
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
                                start_date: startDate,
                                end_date: startDate,
                            }}
                            validationSchema={Yup.object({
                                start_date: Yup.date()
                                    .min(new Date(), "Date must not be in the past")
                                    .required("Required field"),
                                end_date: Yup.date()
                                    .min(Yup.ref('start_date'), "Date must not be in the past")
                                    .required("Required field")
                                    .when(
                                        "start_date",
                                        (start_date, schema) => start_date && schema.min(startDate)),
                                room_id: Yup.number()
                                    .required("Required field"),
                            })}
                            onSubmit={(values, {setSubmitting}) => {
                                setTimeout(() => {
                                    createReservation(values);
                                    setSubmitted(false);
                                    setSubmitting(false);
                                }, 500);
                            }}
                        >
                            {(formik) => (
                                <div className="flex card justify-content-center">
                                    <Form className="flex flex-column gap-2">
                                        <ReservationCalendar id="start_date" name="start_date" label="From"
                                                             value={startDate}/>
                                        <ReservationCalendar id="end_date" name="end_date" label="To"
                                                             value={startDate}/>
                                        <ReservationSelect id="room_id" name="room_id" options={rooms}
                                                           optionLabel="description"
                                                           optionValue="id" label="Room"/>
                                        <ReservationInput id="email" name="email" label="Email"/>
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

        case "error":
            return (
                <div>
                    <ErrorResponse
                        status={listReservationsCall.status}
                        statusText={listReservationsCall.statusText}
                        message={listReservationsCall.error}
                    />
                </div>
            );
        case "login":
            return (
                <div>
                    <LoginForm />
                </div>
            );
        default:
            return (
                <div>
                    <Progress/>
                </div>
            );
    }
}

export default Scheduler;