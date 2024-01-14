import React, {useEffect, useRef, useState} from 'react'
import {ReservationService} from "../Service";
import {Toast} from "primereact/toast";
import ErrorResponse from "./ErrorResponse";
import Progress from "./Progress";
import LoginForm from "./LoginForm";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {DataView} from "primereact/dataview";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import ReservationCalendar from "./ReservationCalendar";
import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBed, faCheck, faMagnifyingGlass, faTrashCan, faXmark} from "@fortawesome/free-solid-svg-icons";
import {Card} from "primereact/card";
import {Dialog} from "primereact/dialog";
import {Tag} from "primereact/tag";
import {Divider} from 'primereact/divider';

function UserReservation() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const [room, setRoom] = useState(null);
    const [startDate, setStartDate] = useState(d);
    const [endDate, setEndDate] = useState(d);
    const [rooms, setRooms] = useState([]);
    const [deleteReservationDialog, setDeleteReservationDialog] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [user, setUser] = useState(null);
    const [reservation, setReservation] = useState([]);
    const [createReservationDialog, setCreateReservationDialog] = useState(false);
    const [userReservationsCall, setUserReservationsCall] = useState({
        state: "pending",
    });
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        try {
            ReservationService.getUserInfo().then(async (response) => {
                const userRes = await response.json();
                switch (response.status) {
                    case 200:
                        setUser(userRes);
                        if (userRes.UserRole.name === "Admin") {
                            ReservationService.getReservations().then(async (response2) => {
                                const reservationsRes = await response2.json();
                                switch (response2.status) {
                                    case 200:
                                        setReservations(reservationsRes);
                                        setUserReservationsCall({state: "success"});
                                        break;
                                    case 404:
                                        setUserReservationsCall({state: "success"});
                                        break;
                                    default:
                                        setUserReservationsCall({state: "error", error: reservationsRes.error});
                                }
                            });
                        } else {
                            ReservationService.getUserReservations(userRes.id).then(async (response2) => {
                                const userReservationsRes = await response2.json();
                                switch (response2.status) {
                                    case 200:
                                        setReservations(userReservationsRes);
                                        setUserReservationsCall({state: "success"});
                                        break;
                                    case 404:
                                        setUserReservationsCall({state: "success"});
                                        break;
                                    default:
                                        setUserReservationsCall({state: "error", error: userReservationsRes.error});
                                }
                            });
                        }
                        break;
                    case 401:
                        console.log(response);
                        setUserReservationsCall({state: "login"});
                        break;

                    default:
                        setUserReservationsCall({state: "error", error: userRes.message});
                        break;
                }
            });
        } catch (error) {
            setUserReservationsCall({state: "error", error: error.message});
        }
    }, []);

    function getType(x) {
        switch (x) {
            case 1:
                return "Relax";
            case 2:
                return "Luxury";
            case 3:
                return "Presidential";
            default:
                return null;
        }
    }

    const getDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const filterReservations = (values) => {
        setSubmitted(true);
        values.start_date = getDateString(new Date(values.start_date));
        values.end_date = getDateString(new Date(values.end_date));
        setStartDate(new Date(values.start_date));
        setEndDate(new Date(values.end_date));
        ReservationService.getAvailableRooms(values).then(async (response) => {
            const responseJson = await response.json();
            if (response.ok) {
                responseJson.map((room) => (room.type_id = getType(room.type_id)));
                setRooms(responseJson);
                if (responseJson.length === 0) {
                    toast.current.show({
                        severity: "warn",
                        summary: "No Rooms",
                        detail: `We are sorry, but we don't have available rooms in this term`,
                        life: 5000,
                    });
                }
            } else {
                console.log(response);
                toast.current.show({
                    severity: "danger",
                    summary: "Error",
                    detail: `Something went wrong ${responseJson.error}`,
                    life: 3000,
                });
            }
        });
    };

    const deleteReservation = () => {
        ReservationService.deleteReservation(reservation.id).then(async (res) => {
            const response = await res.json();
            switch (res.status) {
                case 200: {
                    let _reservation = reservations.filter((val) => val.id !== reservation.id);
                    setReservations(_reservation);
                    toast.current.show({
                        severity: "success",
                        summary: "OK",
                        detail: `Reservation ${reservation.id} has been deleted!`,
                        life: 3000,
                    });
                    break;
                }
                case 404: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `Reservation ${reservation.id} not found!`,
                        life: 3000,
                    });
                    break;
                }
                default: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `${response.error}`,
                        life: 3000,
                    });
                    break;
                }
            }
        });
        setDeleteReservationDialog(false);
        setReservation(null);
    };

    const createReservation = (values) => {
        setSubmitted(true);
        const res = {room_id: values.id, start_date: getDateString(startDate), end_date: getDateString(endDate)}
        ReservationService.postReservation(res).then(async (response) => {
            const responseJson = await response.json();
            if (response.ok) {
                let _reservations = [...reservations];
                _reservations.push(responseJson);
                setReservations(_reservations);
                toast.current.show({
                    severity: "success",
                    summary: "OK",
                    detail: `Reservation ${responseJson.id} was added`,
                    life: 3000,
                });
            } else {
                console.log(response);
                toast.current.show({
                    severity: "danger",
                    summary: "Error",
                    detail: `Something went wrong ${responseJson.message}`,
                    life: 3000,
                });
            }
        });
        setEndDate(d);
        setRooms([]);
    }

    const confirmDeleteReservation = (data) => {
        setReservation(data);
        setDeleteReservationDialog(true);
    };

    const hideDeleteReservationDialog = () => {
        setDeleteReservationDialog(false);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon={<FontAwesomeIcon icon={faTrashCan}/>}
                    rounded
                    outlined
                    severity="danger"
                    visible={user.UserRole.id < 3}
                    onClick={() => confirmDeleteReservation(rowData)}
                />
            </React.Fragment>
        );
    };

    const userTemplate = (rowData) => {
        if (user.UserRole.name === 'User') {
            return user.email;
        }
        ReservationService.getUser(rowData.user_id).then(async (res) => {
            if (res.ok) {
                const u = await res.json();
                return u.email;
            }
        })
        return rowData.user_id

    };

    const typeBodyTemplate = (type) => {
        return (
            <Tag
                value={type}
                rounded
                severity={getSeverity(type)}
            ></Tag>
        );
    };
    const getSeverity = (r) => {
        switch (r) {
            case "Luxury":
                return "success";
            case "Relax":
                return "info";
            case "Presidential":
                return "danger";
            default:
                return "warning";
        }
    };

    const getRoomCard = (r) => {
        return (
            <div className="card flex justify-content-center m-5">
                <Card
                    title={typeBodyTemplate(r.type_id)}
                    subTitle={r.description}
                    footer={footer(r)}
                    header={header(r)}
                    className="md:w-20rem"
                >
                </Card>
            </div>
        );
    };

    const deleteReservationDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon={<FontAwesomeIcon icon={faXmark} className="mr-1"/>}
                outlined
                onClick={hideDeleteReservationDialog}
            />
            <Button
                label="Yes"
                icon={<FontAwesomeIcon icon={faCheck} className="mr-1"/>}
                severity="danger"
                onClick={deleteReservation}
            />
        </React.Fragment>
    );

    const header = (r) => (
        <div className="flex flex-wrap justify-content-between gap-2 ml-3 mt-1 mr-3">
            <h4>Room number: {r.room_number}</h4>
            <Tag className="m-3" icon={<FontAwesomeIcon className="mr-2" icon={faBed}/>} severity="warning"
                 value={r.beds}></Tag>
        </div>
    );

    const footer = (r) => (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button
                label="Create reservation"
                onClick={() => {
                    createReservation(r);
                }}
            />
        </div>
    );

    switch (userReservationsCall.state) {
        case "success":
            return (
                <div className="card m-3">
                    <Toast ref={toast}/>
                    <Formik
                        initialValues={{
                            start_date: startDate,
                            end_date: endDate,
                        }}
                        validationSchema={Yup.object({
                            start_date: Yup.date()
                                .min(d, "Date must not be in the past")
                                .required("Required field"),
                            end_date: Yup.date()
                                .required("Required field")
                                .test('is-after-start', 'Date To must be after From date', function (value) {
                                    const {start_date} = this.parent;
                                    return value >= start_date;
                                }),
                        })}
                        onSubmit={(values, {setSubmitting}) => {
                            setTimeout(() => {
                                filterReservations(values);
                                setSubmitted(false);
                                setSubmitting(false);
                            }, 500);
                        }}
                    >
                        {(formik) => (
                            <div className="flex card align-content-center justify-content-center">
                                <Form className="flex gap-2">
                                    <ReservationCalendar id="start_date" name="start_date" label="From"
                                                         value={startDate}/>
                                    <ReservationCalendar id="end_date" name="end_date" label="To" value={endDate}/>
                                    <Button
                                        type="submit"
                                        severity="success"
                                        icon={<FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1"/>}
                                        label="Find available rooms"
                                        className="m-3"
                                    />
                                </Form>
                            </div>
                        )}
                    </Formik>
                    <DataView emptyMessage=" " value={rooms} layout="grid" itemTemplate={getRoomCard}/>
                    <Divider/>
                    <DataTable
                        value={reservations}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="From {first} to {last} in total {totalRecords} records"
                        header="User's reservations"
                        stripedRows
                    >
                        <Column
                            field="id"
                            header="ID"
                            sortable
                            style={{minWidth: "12rem"}}
                        ></Column>
                        <Column
                            header="User"
                            body={userTemplate}
                            sortable
                            style={{minWidth: "12rem"}}
                        ></Column>
                        <Column
                            header="Room"
                            field="room_id"
                            sortable
                            style={{minWidth: "12rem"}}
                        ></Column>
                        <Column
                            field="start_date"
                            header="Start"
                            sortable
                            style={{minWidth: "16rem"}}
                        ></Column>
                        <Column
                            field="end_date"
                            header="End"
                            sortable
                            style={{minWidth: "16rem"}}
                        ></Column>
                        <Column
                            body={actionBodyTemplate}
                            exportable={false}
                            style={{minWidth: "12rem"}}
                        ></Column>
                    </DataTable>

                    <Dialog
                        visible={deleteReservationDialog}
                        style={{width: "32rem"}}
                        breakpoints={{"960px": "75vw", "641px": "90vw"}}
                        header="Confirmation"
                        modal
                        footer={deleteReservationDialogFooter}
                        onHide={hideDeleteReservationDialog}
                    >
                        <div className="confirmation-content">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{fontSize: "2rem"}}
                            />
                            {reservation && (
                                <span>
              Do you really want to delete <b>{reservation.id}</b>?
            </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            );

        case "error":
            return (
                <div>
                    <ErrorResponse
                        status={userReservationsCall.status}
                        statusText={userReservationsCall.statusText}
                        message={userReservationsCall.error}
                    />
                </div>
            );
        case "login":
            return (
                <div>
                    <LoginForm/>
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

export default UserReservation;