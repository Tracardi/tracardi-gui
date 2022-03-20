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


export default function UserLogs() {

    const mounted = React.useRef(false);
    const [query, setQuery] = React.useState("");

    const renderRowFunc = (row, index) => {
        return (
            <tr key={index} className="LogListRow">
                <td>{row.timestamp}</td>
                <td>{row.email}</td>
                <td>{row.successful ? "Success" : "Failed"}</td>
            </tr>
        );
    }

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    return (
        <div>
            <FilterAddForm 
                style={{margin: 20}}
                textFieldLabel="Type here to filter user logs by query string"
                onFilter={filter => setQuery(filter)}
            />
            <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
                <TuiFormGroup fitHeight={true}>
                    <TuiFormGroupHeader header="Tracardi user logs" description="List of users' log-in actions."/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField>
                            <div style={{overflow: "hidden", height: "inherit"}}>
                                <AutoLoadLogList 
                                    label="USER LOGS"
                                    onLoadRequest={{
                                        url: "/user-logs",
                                        method: "GET",
                                        data: {
                                            where: query
                                        }
                                    }}
                                    renderRowFunc={renderRowFunc}
                                    requestParams={query !== "" ? {query} : {}}
                                />
                            </div>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
        </div>
    );
}