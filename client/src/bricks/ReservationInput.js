import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React from "react";
import { useField } from "formik";

const CookInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-1 mt-3">
      <span className="p-float-label">
        <InputText
          id={props.id}
          name={props.name}
          {...field}
          {...props}
          className={classNames({
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
    </div>
  );
};

export default CookInput;
