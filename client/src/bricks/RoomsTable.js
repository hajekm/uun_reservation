import React, {useEffect, useRef, useState} from "react";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Toast} from "primereact/toast";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {FilterMatchMode} from "primereact/api";
import {Tag} from "primereact/tag";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCirclePlus, faPencil, faSave, faTrashCan, faXmark,} from "@fortawesome/free-solid-svg-icons";
import {Dialog} from "primereact/dialog";
import * as Yup from "yup";
import {Form, Formik} from "formik";

import ReservationInput from "./ReservationInput";
import RoomTypeSelect from "./RoomTypeSelect";
import {ReservationService} from "../Service";

function RoomsTable() {
    let emptyRoom = {
        room_number: "",
        created_at: "",
        type_id: "",
        id: "",
        beds: "",
        price: "",
        description: "",
    };

    let emptyUser = {
        id: "",
        email: "",
        UserRole: {
            name: "",
            id: "",
        },
        created_at: "",
    };

    const [rooms, setRooms] = useState();
    const [createRoomDialog, setCreateRoomDialog] = useState(false);
    const [editRoomDialog, setEditRoomDialog] = useState(false);
    const [deleteRoomDialog, setDeleteRoomDialog] = useState(false);
    const [room, setRoom] = useState(emptyRoom);
    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
        role: {value: null, matchMode: FilterMatchMode.EQUALS},
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const toast = useRef(null);
    const [listUsersCall, setListUsersCall] = useState({
        state: "pending",
    });

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

    function getType_id(r) {
        switch (r) {
            case "Luxury":
                return 2;

            case "Relax":
                return 1;

            case "Presidential":
                return 3;

            default:
                return null;
        }
    }

    // zdá se, že chyba je při prvním načtení stránky. Uvnitř useEffect hooku měl být nastaven user pomocí setUser(responseJson). Tento user má klíč UserRole a ten á zase klíč name... tedy Create Room button by mělo být viditelné, když je user.UserRole.name === "Admin", ale tránka mi vrací error, že name je undefined...?
    useEffect(() => {
        ReservationService.getUserInfo().then(async (response) => {
            try {
                const responseJson = await response.json();
                switch (response.status) {
                    case 200: {
                        setUser(responseJson);
                        // console.log(user);
                        break;
                    }
                    case 401: {
                        console.log(response);
                        setListUsersCall({state: "login"});
                        break;
                    }
                    default: {
                        console.log(response);
                        setListUsersCall({
                            state: "error",
                            error: responseJson.message,
                        });
                        break;
                    }
                }
            } catch (error) {
                setListUsersCall({state: "error", error: error.message});
            }
        });

        ReservationService.getRooms().then(async (response) => {
            try {
                let responseJson = await response.json();

                switch (response.status) {
                    case 200: {
                        // ReservarionService.getTypes() - to mi vrátí opět všechny pokoje, kde bude Id a název daného id, to já pak přepíšu...
                        // potřebuju připravit endpoint
                        setListUsersCall({state: "success"});
                        responseJson.map((room) => (room.type_id = getType(room.type_id)));
                        setRooms(responseJson);
                        break;
                    }
                    case 401: {
                        console.log(response);
                        setListUsersCall({state: "login"});
                        break;
                    }
                    default: {
                        console.log(response);
                        setListUsersCall({state: "error", error: responseJson.message});
                        break;
                    }
                }
            } catch (error) {
                setListUsersCall({state: "error", error: error.message});
            }
        });
    }, []);

    const deleteRoom = () => {
        ReservationService.deleteRoom(room.id).then(async (res) => {
            const response = await res.json();
            switch (res.status) {
                case 200: {
                    let _rooms = rooms.filter((val) => val.id !== room.id);
                    setRooms(_rooms);
                    toast.current.show({
                        severity: "success",
                        summary: "OK",
                        detail: `Room ${room.room_number} has been deleted!`,
                        life: 3000,
                    });

                    break;
                }
                case 404: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `Room ${room.room_number} not found!`,
                        life: 3000,
                    });
                    break;
                }
                case 403: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `Unsufficient rights`,
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
        setDeleteRoomDialog(false);
        setRoom(emptyRoom);
    };

    const createRoom = (values) => {
        setSubmitted(true);
        setCreateRoomDialog(false);

        values.type_id = getType_id(values.type_id);

        ReservationService.postRoom(values).then(async (res) => {
            const response = await res.json();

            switch (res.status) {
                case 200: {
                    let _rooms = [...rooms];
                    setRoom(response);
                    let _room = response;
                    _room.type_id = getType(response.type_id);

                    _rooms.push(_room);
                    setRooms(_rooms);
                    toast.current.show({
                        severity: "success",
                        summary: "OK",
                        detail: `Room ${values.room_number} has been created!`,
                        life: 3000,
                    });

                    setCreateRoomDialog(false);
                    setRoom(emptyRoom);

                    break;
                }

                default: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `${response.message}`,
                        life: 3000,
                    });
                    break;
                }
            }
        });
    };

    const editRoom = (values) => {
        setSubmitted(true);
        setEditRoomDialog(false);

        // upravuje values tak, aby server dostal, co očekává, tedy type_id 1 2 nebo 3...
        values.type_id = getType_id(values.type_id);

        ReservationService.putRoom(values).then(async (res) => {
            const response = await res.json();

            switch (res.status) {
                case 200: {
                    let _rooms = [...rooms];
                    setRoom(response);
                    let _room = response;
                    // opět mění type_id 1 2  nebo 3 na slovní formu...
                    _room.type_id = getType(response.type_id);

                    const index = rooms.findIndex((e) => e.id === _room.id);
                    _rooms[index] = _room;
                    toast.current.show({
                        severity: "success",
                        summary: "OK",
                        detail: `Room ${values.room_number} has been edited!`,
                        life: 3000,
                    });

                    setRooms(_rooms);
                    setRoom(emptyRoom);
                    break;
                }
                case 403: {
                    toast.current.show({
                        severity: "danger",
                        summary: "Fail",
                        detail: `Unsufficient rights`,
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
    };

    const openCreateRoomDialog = () => {
        setRoom(emptyRoom);
        setSubmitted(false);
        setCreateRoomDialog(true);
    };

    const editRoomButton = (data) => {
        setRoom(data);
        setEditRoomDialog(true);
    };
    const confirmDeleteRoom = (data) => {
        setRoom(data);
        setDeleteRoomDialog(true);
    };

    const hideCreateRoomDialog = () => {
        setSubmitted(false);
        setCreateRoomDialog(false);
    };

    const hideEditRoomDialog = () => {
        setSubmitted(false);
        setEditRoomDialog(false);
    };
    const hideDeleteRoomDialog = () => {
        setDeleteRoomDialog(false);
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Create room"
                    icon={<FontAwesomeIcon className="mr-1" icon={faCirclePlus}/>}
                    severity="success"
                    onClick={openCreateRoomDialog}
                    visible={user.UserRole.name === "Admin"}
                />
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon={<FontAwesomeIcon icon={faPencil}/>}
                    rounded
                    outlined
                    className="mr-2"
                    severity="info"
                    onClick={() => editRoomButton(rowData)}
                />
                <Button
                    icon={<FontAwesomeIcon icon={faTrashCan}/>}
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteRoom(rowData)}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Rooms management</h4>
            <span className="p-input-icon-left">
        <i className="pi pi-search"/>
        <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
        />
      </span>
        </div>
    );
    const roleBodyTemplate = (room) => {
        return (
            <Tag
                value={room.type_id}
                rounded
                severity={getSeverity(room.type_id)}
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
                return null;
        }
    };

    function dialogHeader() {
        if (room.id) {
            return "Update room";
        }
        return "Create room";
    }

    const deleteRoomDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon={<FontAwesomeIcon icon={faXmark} className="mr-1"/>}
                outlined
                onClick={hideDeleteRoomDialog}
            />
            <Button
                label="Yes"
                icon={<FontAwesomeIcon icon={faCheck} className="mr-1"/>}
                severity="danger"
                onClick={deleteRoom}
            />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast}/>
            <br/>
            <div className="card">
                <Toolbar className="mb-4" start={leftToolbarTemplate}/>
                <DataTable
                    value={rooms}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="From {first} to {last} in total {totalRecords} records"
                    filters={filters}
                    filterDisplay="row"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column
                        field="id"
                        header="ID"
                        visible={true}
                        style={{minWidth: "8rem"}}
                    ></Column>
                    <Column
                        field="room_number"
                        header="Room Number"
                        sortable
                        style={{minWidth: "12rem"}}
                    ></Column>
                    <Column
                        field="type_id"
                        header="Type"
                        sortable
                        body={roleBodyTemplate}
                        style={{minWidth: "8rem"}}
                    ></Column>
                    <Column
                        field="beds"
                        header="Capacity"
                        sortable
                        style={{minWidth: "8rem"}}
                    ></Column>
                    <Column
                        field="price"
                        header="Price"
                        sortable
                        style={{minWidth: "8rem"}}
                    ></Column>
                    <Column
                        field="description"
                        header="Description"
                        sortable
                        style={{minWidth: "16rem"}}
                    ></Column>
                    <Column
                        field="options"
                        header="Options"
                        sortable
                        style={{minWidth: "16rem"}}
                    ></Column>

                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{minWidth: "12rem"}}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={createRoomDialog}
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header={dialogHeader}
                modal
                className="p-fluid"
                onHide={hideCreateRoomDialog}
            >
                <Formik
                    initialValues={{
                        room_number: room.room_number,
                        type_id: room.type_id,
                        description: room.description,
                        price: room.price,
                        beds: room.beds,
                        options: room.options,
                    }}
                    validationSchema={Yup.object({
                        room_number: Yup.number().required("Required field"),
                        type_id: Yup.string()
                            .oneOf(["Relax", "Luxury", "Presidential"], "Unknown type")
                            .required("Required field"),
                        beds: Yup.number().required("Required field"),
                        price: Yup.number().required("Required field"),
                        description: Yup.string().required("Required field"),
                        options: Yup.string().required("Required field"),
                    })}
                    onSubmit={(values, {setSubmitting}) => {
                        setTimeout(() => {
                            createRoom(values); // pošlou se zadané hodnoty, struktura jako InitialValues (nemá se posílat ID, to bych měl vyřešit zvlášť ve funkci createRoom asi?)
                            setSubmitted(false);
                            setSubmitting(false);
                        }, 500);
                    }}
                >
                    {(formik) => (
                        <div className="flex card justify-content-center">
                            <Form className="flex flex-column gap-2">
                                <ReservationInput
                                    id="room_number"
                                    name="room_number"
                                    label="room_number"
                                />
                                <RoomTypeSelect id="type_id" name="type_id" label="type"/>
                                <ReservationInput id="beds" name="beds" label="beds"/>
                                <ReservationInput id="price" name="price" label="Price"/>
                                <ReservationInput
                                    id="description"
                                    name="description"
                                    label="description"
                                />
                                <ReservationInput id="options" name="options" label="options"/>
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

            <Dialog // EDIT ROOM
                visible={editRoomDialog}
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header={dialogHeader}
                modal
                className="p-fluid"
                onHide={hideEditRoomDialog}
            >
                <Formik
                    initialValues={{
                        id: room.id,
                        room_number: room.room_number,
                        type_id: room.type_id,
                        description: room.description,
                        price: room.price,
                        beds: room.beds,
                        options: room.options,
                    }}
                    validationSchema={Yup.object({
                        room_number: Yup.number().required("Required field"),
                        type_id: Yup.string()
                            .oneOf(["Relax", "Luxury", "Presidential"], "Unknown type")
                            .required("Required field"),
                        beds: Yup.number().required("Required field"),
                        price: Yup.number().required("Required field"),
                        description: Yup.string().required("Required field"),
                        options: Yup.string().required("Required field"),
                    })}
                    onSubmit={(values, {setSubmitting}) => {
                        setTimeout(() => {
                            editRoom(values); // pošlou se zadané hodnoty, struktura jako InitialValues (zde se pošle i ID)
                            setSubmitted(false);
                            setSubmitting(false);
                        }, 500);
                    }}
                >
                    {(formik) => (
                        <div className="flex card justify-content-center">
                            <Form className="flex flex-column gap-2">
                                <ReservationInput
                                    id="room_number"
                                    name="room_number"
                                    label="room_number"
                                />
                                <RoomTypeSelect id="type_id" name="type_id" label="type"/>
                                <ReservationInput id="beds" name="beds" label="beds"/>
                                <ReservationInput id="price" name="price" label="Price"/>
                                <ReservationInput
                                    id="description"
                                    name="description"
                                    label="description"
                                />
                                <ReservationInput id="options" name="options" label="options"/>
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

            <Dialog
                visible={deleteRoomDialog}
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header="Confirmation"
                modal
                footer={deleteRoomDialogFooter}
                onHide={hideDeleteRoomDialog}
            >
                <div className="confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{fontSize: "2rem"}}
                    />
                    {room && (
                        <span>
              Do you really want to delete <b>{room.room_number}</b>?
            </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default RoomsTable;
