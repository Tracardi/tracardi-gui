import React from 'react';
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {BsGear, BsTrash} from "react-icons/bs";
import IconButton from "../../misc/IconButton";
import TuiTags from "../../tui/TuiTags";

const BrowserRow = ({id, data, onClick, onDelete, onSettingsClick, tags, children, status, lock}) => {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }

    return (
        <div style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", borderBottom: "solid 1px #ccc", padding: "0 10px"}}>
            <div 
                style={{
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                    fontSize: 14,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0"
                }}
                onClick={(ev) => {
                    onClick(id)
                }}
            >

                <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                    <span style={{color: "#555", display: "flex"}}><FlowNodeIcons icon={data?.icon} size={22}/></span>
                    <div style={{display: "flex", alignItems: "baseline", marginLeft: 10, gap: 5}}>
                        <div className="flexLine" style={{fontSize: 16, marginRight: 5, fontWeight: 500, width: 200}}>{data.name}</div>
                        <div className="flexLine" style={{fontSize: 13}}>{children ? children : data.description}</div>

                    </div>
                </div>
                <div className="flexLine" style={{gap: 3}}>
                    {Array.isArray(tags) && <TuiTags tags={tags} size="small"/>}
                    {lock && <FlowNodeIcons icon="lock" size={22}/>}
                    {typeof  status !== 'undefined'  && <div
                        style={{margin: "0 5px", width: 14, height: 14, borderRadius: 14, backgroundColor: statusColor(status)}}></div>}
                </div>

            </div>
            {onSettingsClick instanceof Function && <IconButton label={"Settings"}
                                                                style={{color:"black"}}
                                                                onClick={() => onSettingsClick(id)}>
                <BsGear size={20}/>
            </IconButton>}
            {onDelete instanceof Function && <IconButton label={"Delete"}
                                                         style={{color:"black"}}
                                                         onClick={() => onDelete(id)}>
                <BsTrash size={20}/>
            </IconButton>}
        </div>
    );
}

export default BrowserRow;
