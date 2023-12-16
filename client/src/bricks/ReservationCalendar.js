import {classNames} from "primereact/utils";
import React from "react";
import {useField} from "formik";
import {Calendar} from "primereact/calendar";

const ReservationCalendar = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return (
        <div className="mb-1 mt-3">
      <span className="p-float-label">
        <Calendar
            id={props.id}
            name={props.name}
            readOnlyInput
            showIcon
            minDate={new Date()}
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

export default ReservationCalendar;
