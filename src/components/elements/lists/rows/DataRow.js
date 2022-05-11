import React from 'react';
import {BsTrash} from "react-icons/bs";

const DataRow = ({id, onClick, children, onDelete, actions = []}) => {

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
                 if(onClick instanceof Function) {
                     onClick(id)
                 }
             }}>

            <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                {children}
            </div>

            <div style={{display: "flex", alignItems: "center"}}>
                {Array.isArray(actions) && actions.map((item, key) => <span key={key}>{item(id)}</span>)}
            </div>
        </div>
    );
}

export default DataRow;
