import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import DataRow from "../elements/lists/rows/DataRow";
import ImportProgress from "../elements/misc/ImportProgress";
import {BsPlayCircle} from "react-icons/bs";
import IconText from "../elements/misc/IconText";
import {VscSymbolEvent} from "react-icons/vsc";


export default function ImportTasks() {

    const urlFunc = useCallback((query) => ('/tasks' + ((query) ? "?query=" + query : "")), []);

    const rows = (data, onClick) => {

        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <DataRow key={index + "-" + subIndex}
                                        id={row?.id}
                                        // onClick={() => onClick(row?.id)}
                                        onDelete={(id) => console.log(row?.id, row?.task_id)}
                        >
                            <span style={{color: "#555", display: "flex"}}><BsPlayCircle size={20}/></span>
                            <div style={{display: "flex", alignItems: "center", marginLeft: 10}}>
                                <div style={{fontSize: 16, marginRight: 5, fontWeight: 500, width: 200}}>
                                    {row.name}
                                </div>
                                <div style={{display: "flex", alignItems: "baseline", margin: "2px 5px"}}>
                                    <div style={{width: 200, margin: "2px 10px"}}>
                                        <ImportProgress taskId={row?.task_id}/>
                                    </div>
                                </div>
                                <div style={{fontSize: 12, display: "flex", alignItems: "baseline", margin: "2px 10px 2px 5px"}}>
                                    {row.timestamp}
                                </div>
                                <div style={{display: "flex", fontSize: 13, marginRight: 5}}>
                                    <IconText color="#aaa">{row.import_type || "n/a"}</IconText>
                                </div>
                                <div style={{display: "flex", fontSize: 13, marginRight: 5}}>
                                    <IconText color="#1976d2" icon={<VscSymbolEvent size={20} style={{color: "white"}}/>}>{row.event_type || "n/a"}</IconText>
                                </div>



                            </div>
                        </DataRow>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Import tasks"
        defaultLayout="rows"
        description="List of running and completed import tasks."
        urlFunc={urlFunc}
        rowFunc={rows}
        className="Pad10"
    />
}