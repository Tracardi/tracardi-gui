import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import DataRow from "../elements/lists/rows/DataRow";
import ImportProgress from "../elements/misc/ImportProgress";
import IconText from "../elements/misc/IconText";
import {asyncRemote} from "../../remote_api/entrypoint";
import {IoCloseCircle, IoPlayCircleOutline, IoRefreshCircle, IoCloseCircleOutline} from "react-icons/io5";
import Button from "../elements/forms/Button";

function DeleteButton({id}) {

    const [clicked, setClicked] = useState(false)

    const handleDelete = async (taskId) => {
        try {
            const response = await asyncRemote({
                url: `/import/task/${taskId}`,
                method: "delete"
            })
            setClicked(true);
        } catch (e) {

        }

    }

    return (clicked)
        ? <IoCloseCircleOutline size={24} style={{color: "gray"}}/>
        : <IoCloseCircle size={24} onClick={() => handleDelete(id)}/>

}

export default function BackgroundTasks() {

    const [refresh, setRefresh] = useState(0);
    const urlFunc = useCallback((query) => ('/tasks' + ((query) ? "?query=" + query : "")), []);

    const RefreshButton = () => {

        return <Button label="Refresh"
                       icon={<IoRefreshCircle size={20}/>}
                       onClick={() => setRefresh(refresh + 1)}
        />
    }


    const rows = (data, onClick) => {

        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <DataRow key={index + "-" + subIndex}
                                        id={row?.task_id}
                            // onClick={() => onClick(row?.id)}
                                        actions={[
                                            (id) => <div style={{width: 200, margin: "2px 10px"}}>
                                                <ImportProgress taskId={id}/>
                                            </div>,
                                            (id) => <DeleteButton id={id}/>
                                        ]}
                        >
                            <span style={{color: "#555", display: "flex"}}><IoPlayCircleOutline size={24}/></span>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{fontSize: 12, display: "flex", margin: "2px 10px 2px 5px"}}>
                                    {row.timestamp}
                                </div>
                                <div style={{display: "flex", marginRight: 5}}>
                                    <span style={{fontWeight: 500, fontSize: 16}}>{row.name}</span>
                                    <span style={{display: "flex", fontSize: 13, marginRight: 5}}>
                                        <IconText color="#aaa"
                                                  style={{marginLeft: 15}}>{row.type || "n/a"}</IconText>
                                    </span>
                                </div>
                            </div>
                        </DataRow>
                    })}
                </div>
            </div>
        })
    }

    return <>
        <div style={{display: "flex", justifyContent: "flex-end", margin: "0 15px"}}><RefreshButton/></div>
        <CardBrowser
            label="Background tasks"
            defaultLayout="rows"
            description="List of running and completed background tasks."
            urlFunc={urlFunc}
            rowFunc={rows}
            className="Pad10"
        /></>
}
