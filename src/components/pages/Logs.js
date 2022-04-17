import React from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import AutoLoadLogList from "../elements/lists/AutoLoadLogList";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";

const Logs = () => {

    const [query, setQuery] = React.useState(null);

    const onLoadRequest = {
        url: `/logs`,
        method: "GET"
    }

    const external = (url, newWindow=false) => {
        if(newWindow===true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }
    }

    const renderRowFunc = (row, index) => {
        return (
            <tr key={index} className="LogListRow">
                <td>{row.date}</td>
                <td>{row.level}</td>
                <td>{row.message}</td>
                <td>{row.file}</td>
                <td>{row.line}</td>
            </tr>
        );
    };

    return (
    <>
        <FilterAddForm 
            style={{
                marginTop: 20,
                marginLeft: 20,
                marginRight: 20,
                marginBottom: 0
            }}
            textFieldLabel="Type here to filter logs by query string"
            onFilter={setQuery}
        />
        <div style={{fontSize: 11, marginLeft: 21}}>Do not know how to filter. Click <a style={{textDecoration: "underline", cursor: "pointer"}} onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</a> for information.</div>
        <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header="Tracardi logs" description="List of logged operations."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <div style={{overflow: "auto", height: "inherit"}}>
                            <AutoLoadLogList
                                onLoadRequest={onLoadRequest}
                                label="LOGS"
                                renderRowFunc={renderRowFunc}
                                requestParams={query ? {query} : {}}
                            />
                        </div>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
    </>
    );
}

export default Logs;
