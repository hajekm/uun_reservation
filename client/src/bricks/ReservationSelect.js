import {Dropdown} from "primereact/dropdown";
import {classNames} from "primereact/utils";
import React from "react";
import {useField} from "formik";

const ReservationSelect = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <>
      <span className="p-float-label">
        <Dropdown
            inputId={props.id}
            name={props.name}
            options={props.options}
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

export default ReservationSelect;
