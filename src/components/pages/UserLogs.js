import React from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import AutoLoadList from "../elements/lists/AutoLoadList";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
import Tag from "../elements/misc/Tag";


export default function UserLogs() {

    const mounted = React.useRef(false);
    const [query, setQuery] = React.useState("");

    const renderRowFunc = (row, index) => {
        return (
            <tr key={index} className="LogListRow">
                <td>{row.timestamp}</td>
                <td>{row.email}</td>
                <td>{row.successful ? <Tag backgroundColor="#00C49F" color="white">Success</Tag> : <Tag backgroundColor="#d81b60" color="white">Failed</Tag>}</td>
            </tr>
        );
    }

    const external = (url, newWindow=false) => {
        if(newWindow===true) {
            return () => window.open(url, '_blank', 'location=yes,scrollbars=yes,status=yes')
        } else {
            return () => window.location.href = url;
        }
    }

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    return (
        <div>
            <FilterAddForm 
                style={{margin: 20, marginBottom: 0}}
                textFieldLabel="Type here to filter user logs by query string"
                onFilter={filter => setQuery(filter)}
            />
            <div style={{fontSize: 11, marginLeft: 21}}>Do not know how to filter. Click <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.</div>
            <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
                <TuiFormGroup fitHeight={true}>
                    <TuiFormGroupHeader header="Tracardi user logs" description="List of users' log-in actions."/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField>
                            <div style={{overflow: "hidden", height: "inherit"}}>
                                <AutoLoadList
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