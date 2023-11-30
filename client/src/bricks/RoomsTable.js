import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCheck,
  faCirclePlus,
  faPencil,
  faSave,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ReservationService } from "../Service";
import { Dialog } from "primereact/dialog";
import * as Yup from "yup";
import { Form, Formik } from "formik";


import ReservationInput from "./ReservationInput";
import ReservationSelect from "./ReservationSelect";
import RoomTypeSelect from "./RoomTypeSelect";

const mockRooms = [
  {
    number: 1,
    created_at: "2023-05-19",
    type: "Luxury",
    id: "p4ec32c6-9f83-4e77-8858-9dab18e49a41",
    occupancy: 2,
    price: 2000,
    note: "-"
  },
  {
    number: 2,
    created_at: "2023-05-19",
    type: "Relax",
    id: "tzec32c6-9f41-8e77-9228-9dab18e49a41",
    occupancy: 3,
    price: 1500,
    note: "broken TV"
  },
  {
    number: 3,
    created_at: "2023-05-20",
    type: "Presidential",
    id: "eeec32c6-9f83-4e77-9228-9dae47e49a41",
    occupancy: 1,
    price: 2500,
    note: "reconstruction in progress"
  },
];

const mockUsers = [
  {
    email: "user1@gmail.com",
    created_at: "2023-05-19",
    role: "Admin",
    id: "acec32c6-9f83-4e77-9228-9dab18e49a67",
  },
  {
    email: "user2@gmail.com",
    created_at: "2023-05-19",
    role: "User",
    id: "a9ddb9d0-a32e-4c09-9dca-59a007d0b2d8",
  },
  {
    email: "user3@gmail.com",
    created_at: "2023-05-19",
    role: "SuperUser",
    id: "646b2a56-599c-43e0-b15a-518c7b166d2b",
  },
];

function RoomsTable() {
  let emptyRoom = {
    number: "",
    created_at: "",
    type: "",
    id: "",
    occupancy: "",
    price: "",
    note: ""
  };



  let emptyUser = {
    id: "",
    email: "",
    role: "",
    created_at: "",
  };


  const [users, setUsers] = useState(mockUsers);
  const [rooms, setRooms] = useState(mockRooms);
  const [createRoomDialog, setCreateRoomDialog] = useState(false);
  const [deleteRoomDialog, setDeleteRoomDialog] = useState(false);
  const [room, setRoom] = useState(emptyRoom);
  const [loggedUser, setLoggedUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [types] = useState(["Presidental", "Luxury", "Relax"]);
  const toast = useRef(null);

  // useEffect(() => {
  //   ReservationService.getUsers().then((data) => setUsers(data));
  // }, [users]);

  const deleteRoom = () => {
    let _rooms = rooms.filter((val) => val.id !== room.id);
    setRooms(_rooms);
    setDeleteRoomDialog(false);
    toast.current.show({
      severity: "success",
      summary: "OK",
      detail: `Room ${room.number} has been deleted!`,
      life: 3000,
    });
    setRoom(emptyRoom);
  };

  const createRoom = (values) => {
    setSubmitted(true);
    if (values.number.trim()) {
      let _rooms = [...rooms];
      let _room = { id: values.id, number: values.number, type: values.type, occupancy: values.occupancy, price: values.price, note: values.note };

     

      if (_room.id) {
        const index = rooms.findIndex((e) => e.id === _room.id);
        _rooms[index] = _room;
        toast.current.show({
          severity: "success",
          summary: "OK",
          detail: `Room ${values.number} has been edited!`,
          life: 3000,
        });
      } else {
        _room.id = uuidv4();
        _rooms.push(_room);
        toast.current.show({
          severity: "success",
          summary: "OK",
          detail: `Room ${values.number} has been created!`,
          life: 3000,
        });
      }
      setRooms(_rooms);
      setCreateRoomDialog(false);
      setRoom(emptyRoom);
    }
  };

  const openCreateRoomDialog = () => {
    setRoom(emptyRoom);
    setSubmitted(false);
    setCreateRoomDialog(true);
  };

  const editRoom = (data) => {
    setRoom(data);
    setCreateRoomDialog(true);
  };
  const confirmDeleteRoom = (data) => {
    setRoom(data);
    setDeleteRoomDialog(true);
  };

  const hideCreateRoomDialog = () => {
    setSubmitted(false);
    setCreateRoomDialog(false);
  };
  const hideDeleteRoomDialog = () => {
    setDeleteRoomDialog(false);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Create room"
          icon={<FontAwesomeIcon className="mr-1" icon={faCirclePlus} />}
          severity="success"
          onClick={openCreateRoomDialog}
          visible={loggedUser.role === "SuperUser"}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => (
    <Dropdown
      icon={<FontAwesomeIcon icon={faUsers} className="mr-1" />}
      value={loggedUser}
      onChange={(e) => {
        setLoggedUser(e.value);
      }}
      options={users}
      optionLabel="email"
      placeholder="Log in"
      className="w-full md:w-14rem"
    />
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => editRoom(rowData)}
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrashCan} />}
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
        <i className="pi pi-search" />
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
      <Tag value={room.type} rounded severity={getSeverity(room.type)}></Tag>
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

  const userRoleTemplate = (option) => {
    return <Tag value={option} rounded severity={getSeverity(option)} />;
  };

  const roleRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={types}
        onChange={(e) => { options.filterApplyCallback(e.value)}}
        itemTemplate={userRoleTemplate}
        placeholder="Choose..."
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={hideDeleteRoomDialog}
      />
      <Button
        label="Yes"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteRoom}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <br />
      <div className="card">
        <Toolbar
          className="mb-4"
          start={leftToolbarTemplate}
          end={rightToolbarTemplate}
        />
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
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="number"
            header="Number"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="type"
            header="Type"
            sortable
            body={roleBodyTemplate}
            style={{ minWidth: "12rem" }}
            filter
            showFilterMenu={false}
            filterMenuStyle={{ width: "20rem" }}
            filterElement={roleRowFilterTemplate}
          ></Column>
           <Column
            field="occupancy"
            header="Occupancy"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
           <Column
            field="price"
            header="Price"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
           <Column
            field="note"
            header="Note"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>

          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={createRoomDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header={dialogHeader}
        modal
        className="p-fluid"
        onHide={hideCreateRoomDialog}
      >
        <Formik
          initialValues={{
            id: room.id,
            number: room.number,
            type: room.type,
            occupancy: room.occupancy,
            price: room.price,
            note: room.note
          }}
          validationSchema={Yup.object({
            // je number vhodný datový typ?
            number: Yup.number()
              .required("Required field"),
            type: Yup.string()
              .oneOf(["Presidential", "Luxury", "Relax"], "Unknown type")
              .required("Required field"),
            occupancy: Yup.number()
              .required("Required field"),
            price: Yup.number()
              .required("Required field"),
            note: Yup.string()
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              createRoom(values);
              setSubmitted(false);
              setSubmitting(false);
            }, 500);
          }}
        >
          {(formik) => (
            <div className="flex card justify-content-center">
              <Form className="flex flex-column gap-2">
                <ReservationInput id="number" name="number" label="Number" />
                <RoomTypeSelect id="type" name="type" label="Type" />
                <ReservationInput id="occupancy" name="occupancy" label="Occupancy" />
                <ReservationInput id="price" name="price" label="Price" />
                <ReservationInput id="note" name="note" label="Note" />
                <Button
                  type="submit"
                  severity="secondary"
                  icon={<FontAwesomeIcon icon={faSave} className="mr-1" />}
                  label="Save"
                />
              </Form>
            </div>
          )}
        </Formik>
      </Dialog>

      <Dialog
        visible={deleteRoomDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmation"
        modal
        footer={deleteRoomDialogFooter}
        onHide={hideDeleteRoomDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {room && (
            <span>
              Do you really want to delete <b>{room.number}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default RoomsTable;
