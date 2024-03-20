import React from "react";

export default function FieldSet({label, error, children}) {

    const borderStyle = error ? {marginTop: 10, padding: 10, borderColor: "#d81b60"} : {marginTop: 10, padding: 10 }
    const legendStyle = error ? {color: "#d81b60"} : {}

    return <fieldset style={borderStyle}>
        <legend style={legendStyle}>{label}</legend>
        {children}
    </fieldset>
}