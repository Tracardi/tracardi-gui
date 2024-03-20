import ListOfForms from "./ListOfForms";
import FieldComplianceForm from "./FieldComplianceForm";
import React from "react";

const DataComplianceSettings = ({value, onChange}) => {
    return <ListOfForms form={FieldComplianceForm}
                        defaultFormValue={{field: {value:"", ref: true}, consents: [], action: "hash"}}
                        value={value}
                        onChange={onChange}/>
}

export default DataComplianceSettings;