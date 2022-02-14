import React, {useState} from "react";
import ListOfDottedInputs from "../elements/forms/ListOfDottedInputs";
import TimeInput from "../elements/forms/inputs/TimeInput";
import KeyValueForm from "../elements/forms/KeyValueForm";
import IconSelector from "../elements/IconSelector";
import ScheduledForm from "../elements/forms/ScheduledForm";
import NewUser from "./NewUser";
import TuiPieChart from "../elements/charts/PieChart";
import Table from "../elements/table/Table";
import {Column} from "react-vt-table";
import TuiSelectEventType from "../elements/tui/TuiSelectEventType";
import TuiSelectMultiEventType from "../elements/tui/TuiSelectMultiEventType";
import PasswordInput from "../elements/forms/inputs/PasswordInput";
import EvalInput from "../elements/forms/inputs/EvalInput";
import {Button} from "@mui/material";
import DotAccessor from "../elements/forms/inputs/DotAccessor";

export default function TryOut() {
    const [v,setV] = React.useState("`profile@`");
    // const data = [
    //     { id: 1, title: "test", status: "status" },
    //     { id: 2, title: "test 2", status: "status" },
    //     { id: 3, title: "test 3", status: "status" },
    //     { id: 1, title: "test", status: "status" },
    //     { id: 2, title: "test 2", status: "status" },
    //     { id: 3, title: "test 3", status: "status" },
    //     { id: 1, title: "test", status: "status" },
    //     { id: 2, title: "test 2", status: "status" },
    //     { id: 3, title: "test 3", status: "status" },
    //     { id: 1, title: "test", status: "status" },
    //     { id: 2, title: "test 2", status: "status" },
    //     { id: 3, title: "test 3", status: "status" }
    // ];

  return (<div style={{padding: 10}}>
          <DotAccessor label="E-mail" value={v} onChange={(e)=>{console.log("READY", e);setV(e)}}/>
          <Button onClick={()=>setV("test")}>xxx</Button>
      {/*<TuiSelectEventType value={v} onSetValue={(v) => {console.log("value", v); setV(v)}} solo={true}/>*/}
      {/*    <TuiSelectMultiEventType value={v} onSetValue={(v) => {console.log(v); setV(v)}}/>*/}
    <div style={{height: "100%", overflow: "auto"}}>
        {/*<Table data={data} disableHeader={false}>*/}
        {/*    <Column dataKey="id" label="ID" width={20}/>*/}
        {/*    <Column dataKey="title" label="Title" />*/}
        {/*    <Column dataKey="status" label="Status" cellRenderer={({ dataKey, rowData }) => {*/}
        {/*        return <div*/}
        {/*            style={{*/}
        {/*                fontWeight: 'bold',*/}
        {/*                // backgroundColor: rowData.get('color'),*/}
        {/*                backgroundColor: "red",*/}
        {/*                height: '100%',*/}
        {/*                width: '100%',*/}
        {/*                display: 'flex',*/}
        {/*                alignItems: 'center',*/}
        {/*            }}*/}
        {/*        >*/}
        {/*            <div>{rowData.status}</div>*/}
        {/*        </div>*/}
        {/*    }}/>*/}
        {/*</Table>*/}
        {/*<DottedPathInput value={"event@id"} onChange={(v)=>console.log(v)} defaultPathValue={'xxx'} defaultSourceValue={"profile"}/>*/}
      {/*<TuiPieChart/>*/}
      {/*<ScheduledForm  />*/}
      {/*<NewUser/>*/}
      {/*<IconSelector value="alert" onChange={(ic) => console.log(ic)} />*/}
      {/*<KeyValueForm value={{ kw: "value" }} onChange={(v) => console.log(v)} />*/}
      {/*<TimeInput />*/}
      {/*<DottedPathInput value={"ala.kk"} onChange={(v) => console.log(v)} forceMode={2} width={300} />*/}
      <ListOfDottedInputs onChange={(x) => console.log(x)} />
    </div></div>
  );
}
