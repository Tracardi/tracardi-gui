import React from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import TimeInput from "../elements/forms/inputs/TimeInput";
import IconSelector from "../elements/IconSelector";
import Table from "../elements/table/Table";
import {Column} from "react-vt-table";
import {Button} from "@mui/material";
import DotAccessor from "../elements/forms/inputs/DotAccessor";
import BackgroundTaskProgress from "../elements/misc/BackgroundTaskProgress";
import JsonForm from "../elements/forms/JsonForm";

export default function TryOut() {
    const [v,setV] = React.useState("`profile@`");
    const data = [
        { id: 1, title: "test", status: "status" },
        { id: 2, title: "test 2", status: "status" },
        { id: 3, title: "test 3", status: "status" },
        { id: 1, title: "test", status: "status" },
        { id: 2, title: "test 2", status: "status" },
        { id: 3, title: "test 3", status: "status" },
        { id: 1, title: "test", status: "status" },
        { id: 2, title: "test 2", status: "status" },
        { id: 3, title: "test 3", status: "status" },
        { id: 1, title: "test", status: "status" },
        { id: 2, title: "test 2", status: "status" },
        { id: 3, title: "test 3", status: "status" }
    ];

  return (<div style={{padding: 10}}>
          <DotAccessor label="E-mail" value={v} onChange={(e)=>{console.log("READY", e);setV(e)}}/>
          <Button onClick={()=>setV("test")}>xxx</Button>
    <div style={{height: "100%", overflow: "auto"}}>
        <BackgroundTaskProgress taskId="baf6d467-df07-4d94-966a-aac6a034321s"/>
        <Table data={data} disableHeader={false}>
            <Column dataKey="id" label="ID" width={20}/>
            <Column dataKey="title" label="Title" />
            <Column dataKey="status" label="Status" cellRenderer={({ dataKey, rowData }) => {
                return <div
                    style={{
                        fontWeight: 'bold',
                        // backgroundColor: rowData.get('color'),
                        backgroundColor: "red",
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div>{rowData.status}</div>
                </div>
            }}/>
        </Table>
      <IconSelector value="alert" onChange={(ic) => console.log(ic)} />
      <TimeInput />
      <ListOfDottedInputs onChange={(x) => console.log(x)} />
      <JsonForm
        schema={{
            title: null,
            groups: [{
                name: null, 
                description: null,
                fields: [{
                    description: "Consent types",
                    id: "consents",
                    name: "Consent types name",
                    required: false,
                    validation: null,
                    component: {
                        type: "consentTypes",
                        props: {label: "Consents"}
                    }
                }]
            }]
        }}
        values={{consents: []}}
      />
    </div></div>
  );
}
