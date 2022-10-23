import React from 'react';
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {BsTrash} from "react-icons/bs";
import Tag from "../../misc/Tag";

const BrowserRow = ({id, data, onClick, onDelete, tags, children}) => {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }
    //{onDelete instanceof Function && <BsTrash size={20} onClick={() => onDelete(id)}/>}

    return (
        <div style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", borderBottom: "solid 1px #ccc"}}>
            <div 
                style={{
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                    fontSize: 14,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10
                }}
                onClick={(ev) => {
                    onClick(id)
                }}
            >

                <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                    <span style={{color: "#555", display: "flex"}}><FlowNodeIcons icon={data?.icon} size={22}/></span>
                    <div style={{display: "flex", alignItems: "baseline", marginLeft: 10}}>
                        <div style={{fontSize: 16, marginRight: 5, fontWeight: 500, width: 200}}>{data.name}</div>
                        <div style={{fontSize: 13}}>{children ? children : data.description}</div>

                    </div>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    {Array.isArray(tags) && <div style={{marginRight: 5}}>{tags.map(tag => <Tag>{tag}</Tag>) }</div>}
                    {typeof data?.enabled !== "undefined" && <div style={{margin: "0 5px", width: 14, height: 14, borderRadius: 14, backgroundColor: statusColor(data?.enabled)}}></div>}
                </div>

            </div>
            {onDelete instanceof Function && <BsTrash size={20} onClick={() => onDelete(id)} style={{cursor: "pointer"}}/>}
        </div>
    );
}

export default BrowserRow;
