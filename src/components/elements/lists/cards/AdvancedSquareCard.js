import React from 'react';
import "./AdvancedSquareCard.css";
import {BsXCircle} from "react-icons/bs";
import {FiEdit3} from "react-icons/fi";

const AdvancedSquareCard = ({id, status, name, description, onClick, icon, onEdit, onDelete}) => {
    const statusClass = (status) => {
        return status ? "icon enabled" : "icon disabled"
    }

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        onDelete(id)
    }

    return (
        <div onClick={(ev) => {
            onClick(id)
        }} className="AdvancedSquareCard">
            <div className="Details">
                <div className={statusClass(status)}>{icon}</div>
                <div className="name">{name}</div>
                <div className="desc">{description}</div>
            </div>
            <div className="Buttons">
                <div className="Button" style={{borderRadius: "0 0 0 10px"}} onClick={() => onEdit(id)}><FiEdit3
                    size={18} style={{marginRight: 8}}/> Edit
                </div>
                <div className="Button" style={{borderRadius: "0 0 10px 0"}} onClick={(e) => handleDeleteClick(e, id)}>
                    <BsXCircle size={18} style={{marginRight: 8}}/> Delete
                </div>
            </div>

        </div>
    );
}
export default React.memo(AdvancedSquareCard)