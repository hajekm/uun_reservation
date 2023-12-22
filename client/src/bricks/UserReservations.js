import React, {useEffect, useRef, useState} from 'react'
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
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";

function UserReservation() {
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
        ReservationService.getUserInfo().then(async (response) => {
            try {
                console.log(response);
                const responseJson = await response.json();
                console.log(responseJson);
                switch (response.status) {
                    case 403: {
                        setListReservationsCall({state: "success"});
                        // setReservations(responseJson);
                        break;
                    }
                    case 401: {
                        console.log(response);
                        setListReservationsCall({state: "login"});
                        break;
                    }
    //                 default: {
    //                     console.log(response);
    //                     setListReservationsCall({state: "error", error: responseJson.message});
    //                     break;
    //                 }
                }
            } catch (error) {
                setListReservationsCall({state: "error", error: error.message});
            }
        });
    }, []);

    // const getDateString = (date) => {
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    //     const day = String(date.getDate()).padStart(2, '0');
    //
    //     return `${year}-${month}-${day}`;
    // }

    // const getEventColor = (state) => {
    //     switch (state) {
    //         case 2: {
    //             return "#FF0000"
    //         }
    //         case 3: {
    //             return "#FF964F"
    //         }
    //         default: {
    //             return "#77DD77"
    //         }
    //     }
    // }

    // const createReservation = (values) => {
    //     setSubmitted(true);
    //     values.start_date = getDateString(values.start_date);
    //     values.end_date = getDateString(values.end_date);
    //     ReservationService.postReservation(values).then(async (response) => {
    //         const responseJson = await response.json();
    //         if (response.ok) {
    //             let _reservations = [...reservations];
    //             _reservations.push(responseJson);
    //             setReservations(_reservations);
    //             toast.current.show({
    //                 severity: "success",
    //                 summary: "Úspěch",
    //                 detail: `Rezervace ${responseJson.id} byla přidána`,
    //                 life: 3000,
    //             });
    //         } else {
    //             console.log(response);
    //             toast.current.show({
    //                 severity: "danger",
    //                 summary: "Chyba",
    //                 detail: `Něco se pokazilo ${responseJson.message}`,
    //                 life: 3000,
    //             });
    //         }
    //     });
    //
    //     setCreateReservationDialog(false);
    //
    // };

    // const handleDateClick = (date) => {
    //     ReservationService.getRooms().then(async (response) => {
    //         try {
    //             const responseJson = await response.json();
    //             if (response.ok) {
    //                 setRooms(responseJson);
    //                 let now = new Date();
    //                 now.setHours(0, 0, 0, 0);
    //                 if (date < now) {
    //                     setStartDate(now);
    //                 } else {
    //                     setStartDate(date);
    //                 }
    //                 setCreateReservationDialog(true);
    //             }
    //         } catch (error) {
    //             toast.current.show({
    //                 severity: "danger",
    //                 summary: "Error",
    //                 detail: `Cannot fetch rooms`,
    //                 life: 3000,
    //             });
    //         }
    //     });
    // }

    switch (listReservationsCall.state) {
        case "success":
            return (
                <div className="card m-3">
                    <Toast ref={toast}/>
                    <DataTable
                        value={reservations}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="From {first} to {last} in total {totalRecords} records"
                        // filters={filters}
                        filterDisplay="row"
                        // globalFilter={globalFilter}
                        stripedRows
                        // header={header}
                    >
                        <Column
                            field="id"
                            header="ID"
                            sortable
                            style={{minWidth: "12rem"}}
                        ></Column>
                        <Column
                            field="username"
                            header="Username"
                            sortable
                            style={{minWidth: "16rem"}}
                        ></Column>
                        <Column
                            field="email"
                            header="Email"
                            sortable
                            style={{minWidth: "16rem"}}
                        ></Column>
                        <Column
                            header="Role"
                            field="role"
                            sortable
                            // body={roleBodyTemplate}
                            style={{minWidth: "12rem"}}
                            filter
                            showFilterMenu={false}
                            filterMenuStyle={{width: "10rem"}}
                            // filterElement={roleRowFilterTemplate}
                        ></Column>
                        <Column
                            // body={actionBodyTemplate}
                            exportable={false}
                            style={{minWidth: "12rem"}}
                        ></Column>
                    </DataTable>
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

export default UserReservation;