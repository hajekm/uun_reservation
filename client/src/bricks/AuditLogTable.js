import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
import { ReservationService } from "../Service";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function AuditLogTable() {
  let emptyUser = {
    id: "",
    email: "",
    role: "",
    created_at: "",
  };

  const [auditLog, setAuditLog] = useState();

  const [loggedUser, setLoggedUser] = useState(emptyUser);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const toast = useRef(null);

  const [listAuditLogCall, setAuditLogCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    ReservationService.getAuditLog().then(async (response) => {
      try {
        const responseJson = await response.json();
        switch (response.status) {
          case 200: {
            setAuditLogCall({ state: "success" });
            setAuditLog(responseJson);
            console.log(responseJson);
            break;
          }
          case 401: {
            console.log(response);
            setAuditLogCall({ state: "login" });
            break;
          }
          default: {
            console.log(response);
            setAuditLogCall({ state: "error", error: responseJson.message });
            break;
          }
        }
      } catch (error) {
        setAuditLogCall({ state: "error", error: error.message });
      }
    });
  }, []);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Audit log</h4>
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const documentContent = (rowData) => {
    // Parse the JSON string into an object
    const parsedDocument = JSON.parse(rowData.document);

    // Get the keys of the parsed object
    const documentKeys = Object.keys(parsedDocument);

    return (
      <React.Fragment>
        {documentKeys.map((key) => (
          <div key={key}>
            <strong>{key}:</strong> {parsedDocument[key]}
          </div>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <br />
      <div className="card">
        <DataTable
          value={auditLog}
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
            field="createdAt"
            header="Date"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="user_email"
            header="Done by"
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="user_role"
            header="Role"
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="model"
            header="Object"
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="operation"
            header="Operation"
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="document"
            header="Document"
            body={documentContent}
            style={{ minWidth: "16rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default AuditLogTable;
