import React from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import AutoLoadLogList from "../elements/lists/AutoLoadLogList";


export default function UserLogs() {

    const mounted = React.useRef(false);
    const [filter, setFilter] = React.useState("");

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
                                        method: "GET"
                                    }}
                                    renderRowFunc={renderRowFunc}
                                />
                            </div>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
        </div>
    );
}