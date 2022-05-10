import React from 'react';
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {BsTrash} from "react-icons/bs";

const BrowserRow = ({id, data, onClick}) => {

    const statusColor = (status) => {
        return status ? "#00c853" : "#d81b60"
    }

    return (
        <div style={{
            display: "flex",
            width: "100%",
            cursor: "pointer",
            fontSize: 14,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
            borderBottom: "solid 1px #ccc"
        }}
             onClick={(ev) => {
                 onClick(id)
             }}>

            <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                <span style={{color: "#555", display: "flex"}}><FlowNodeIcons icon={data?.icon} size={22}/></span>
                <div style={{display: "flex", alignItems: "baseline", marginLeft: 10}}>
                    <div style={{fontSize: 16, marginRight: 5, fontWeight: 500, width: 200}}>{data.name}</div>
                    <div style={{fontSize: 13}}>{data.description}</div>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{margin: "0 5px", width: 14, height: 14, borderRadius: 14, backgroundColor: statusColor(data?.enabled)}}></div>
                <BsTrash size={20}/>
            </div>

        </div>
    );
}

export default BrowserRow;
