import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import { useField } from "formik";

const RoomTypeSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const roles = [
    { name: "Presidential", code: "Presidential" },
    { name: "Luxury", code: "Luxury" },
    { name: "Relax", code: "Relax" },
  ];

  return (
    <>
      <span className="p-float-label">
        <Dropdown
          inputId={props.id}
          name={props.name}
          options={roles}
          optionLabel="name"
          optionValue="code"
          {...field}
          {...props}
          className={classNames("w-full md:w-14rem", {
            "p-invalid": !!(meta.touched && meta.error),
          })}
        />
        <label htmlFor={props.id || props.name}>{label}</label>
      </span>
      {!!(meta.touched && meta.error) ? (
        <small className="p-error">{meta.error}</small>
      ) : (
        <small className="p-error">&nbsp;</small>
      )}
    </>
  );
};

export default RoomTypeSelect;
