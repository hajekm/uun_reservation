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
import { ProgressSpinner } from "primereact/progressspinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCheck,
  faCirclePlus,
  faPencil,
  faSave,
  faTrashCan,
  faXmark,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { ReservationService } from "../Service";
import { Dialog } from "primereact/dialog";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import ReservationInput from "./ReservationInput";
import ReservationSelect from "./ReservationSelect";
import LoginForm from "./LoginForm";
import ErrorResponse from "./ErrorResponse";
import Progress from "./Progress";

function UsersTable() {
  let emptyUser = {
    id: "",
    email: "",
    role: "",
    created_at: "",
  };

  const [users, setUsers] = useState([]);
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [loggedUser, setLoggedUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [roles] = useState(["SuperUser", "Admin", "User"]);
  const toast = useRef(null);
  const [listUsersCall, setListUsersCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    ReservationService.getUsers().then(async (response) => {
      try {
        const responseJson = await response.json();
        switch (response.status) {
          case 200: {
            setListUsersCall({state: "success"});
            setUsers(responseJson);
            break;
          }
          case 401: {
          console.log(response);
          setListUsersCall({ state: "login" });
          break;
        }
          default: {
            console.log(response);
            setListUsersCall({ state: "error", error: responseJson.message });
            break;
          }
        }
      } catch (error) {
        setListUsersCall({ state: "error", error: error.message });
      }
    });
  }, []);

  const deleteUser = () => {
    let _users = users.filter((val) => val.id !== user.id);
    setUsers(_users);
    setDeleteUserDialog(false);
    toast.current.show({
      severity: "success",
      summary: "OK",
      detail: `User ${user.email} has been deleted!`,
      life: 3000,
    });
    setUser(emptyUser);
  };

  const createUser = (values) => {
    setSubmitted(true);
    if (values.email.trim()) {
      let _users = [...users];
      let _user = { id: values.id, email: values.email, role: values.role };

      if (_user.id) {
        const index = users.findIndex((e) => e.id === _user.id);
        _users[index] = _user;
        toast.current.show({
          severity: "success",
          summary: "OK",
          detail: `User ${values.email} has been edited!`,
          life: 3000,
        });
      } else {
        _user.id = uuidv4();
        _users.push(_user);
        toast.current.show({
          severity: "success",
          summary: "OK",
          detail: `User ${values.email} has been created!`,
          life: 3000,
        });
      }
      setUsers(_users);
      setCreateUserDialog(false);
      setUser(emptyUser);
    }
  };

  const openCreateUserDialog = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setCreateUserDialog(true);
  };

  const editUser = (data) => {
    setUser(data);
    setCreateUserDialog(true);
  };
  const confirmDeleteUser = (data) => {
    setUser(data);
    setDeleteUserDialog(true);
  };

  const hideCreateUserDialog = () => {
    setSubmitted(false);
    setCreateUserDialog(false);
  };
  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Create user"
          icon={<FontAwesomeIcon className="mr-1" icon={faCirclePlus} />}
          severity="success"
          onClick={openCreateUserDialog}
          visible={loggedUser.role === "SuperUser"}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon={<FontAwesomeIcon icon={faPencil} />}
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Users management</h4>
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
  const roleBodyTemplate = (user) => {
    return (
      <Tag
        value={user.UserRole.name}
        rounded
        severity={getSeverity(user.UserRole.name)}
      ></Tag>
    );
  };

  const getSeverity = (r) => {
    switch (r) {
      case "SuperUser":
        return "success";

      case "User":
        return "info";

      case "Admin":
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
        options={roles}
        onChange={(e) => options.filterApplyCallback(e.value)}
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
    if (user.id) {
      return "Update user";
    }
    return "Create user";
  }

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon={<FontAwesomeIcon icon={faXmark} className="mr-1" />}
        outlined
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon={<FontAwesomeIcon icon={faCheck} className="mr-1" />}
        severity="danger"
        onClick={deleteUser}
      />
    </React.Fragment>
  );

  if (listUsersCall.state === "pending") {
    return (
      <div className="flex flex-wrap gap-2 align-items-center mt-8 justify-content-center">
        <ProgressSpinner />
      </div>
    );
  }
  if (listUsersCall.state === "error") {
    return (
      <div>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className={"mt-3"}
          size={"4x"}
        />
        <h2>{listUsersCall.error}</h2>
      </div>
    );
  }

  // if (listUsersCall.state === "auth") {
  //   return <LoginForm login={true} />;
  // }
  switch (listUsersCall.state) {
    case "success":
      return (
          <div>
            <Toast ref={toast}/>
            <br/>
            <div className="card">
              <Toolbar
                  className="mb-4"
                  start={leftToolbarTemplate}
              />
              <DataTable
                  value={users}
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
                    field="role"
                    header="Role"
                    sortable
                    body={roleBodyTemplate}
                    style={{minWidth: "12rem"}}
                    filter
                    showFilterMenu={false}
                    filterMenuStyle={{width: "10rem"}}
                    filterElement={roleRowFilterTemplate}
                ></Column>
                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{minWidth: "12rem"}}
                ></Column>
              </DataTable>
            </div>

            <Dialog
                visible={createUserDialog}
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header={dialogHeader}
                modal
                className="p-fluid"
                onHide={hideCreateUserDialog}
            >
              <Formik
                  initialValues={{
                    id: user.id,
                    email: user.email,
                    role: user.role,
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                        .email("Invalid email address")
                        .required("Required field"),
                    role: Yup.string()
                        .oneOf(["User", "Admin", "SuperUser"], "Unknown role")
                        .required("Required field"),
                  })}
                  onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                      createUser(values);
                      setSubmitted(false);
                      setSubmitting(false);
                    }, 500);
                  }}
              >
                {(formik) => (
                    <div className="flex card justify-content-center">
                      <Form className="flex flex-column gap-2">
                        <ReservationInput id="email" name="email" label="Email"/>
                        <ReservationSelect id="role" name="role" label="Role"/>
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
                visible={deleteUserDialog}
                style={{width: "32rem"}}
                breakpoints={{"960px": "75vw", "641px": "90vw"}}
                header="Confirmation"
                modal
                footer={deleteUserDialogFooter}
                onHide={hideDeleteUserDialog}
            >
              <div className="confirmation-content">
                <i
                    className="pi pi-exclamation-triangle mr-3"
                    style={{fontSize: "2rem"}}
                />
                {user && (
                    <span>
              Do you really want to delete <b>{user.email}</b>?
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
                status={listUsersCall.status}
                statusText={listUsersCall.statusText}
                message={listUsersCall.message}
            />
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

export default UsersTable;
