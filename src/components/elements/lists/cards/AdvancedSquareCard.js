import React from 'react';
import "./AdvancedSquareCard.css";
import {BiMessageSquareEdit} from "react-icons/bi";
import IconButton from "../../misc/IconButton";
import {BsTrash} from "react-icons/bs";

const AdvancedSquareCard = ({id, status, name, description, onClick, icon, onEdit, onDelete}) => {
    const statusClass = (status) => {
        return status ? "icon enabled" : "icon disabled"
    }

    return (
        <div onClick={(ev) => {onClick(id)}} className="AdvancedSquareCard">
            <div className="Details">
                <div className={statusClass(status)}>{icon}</div>
                <div className="name">{name}</div>
                <div className="desc">{description}</div>
            </div>
            <div className="Buttons">
                <IconButton
                    label="Edit Workflow"
                    onClick={(e) => {onEdit(id); e.preventDefault(); e.stopPropagation();}}
                    size="large">
                    <BiMessageSquareEdit size={20}/>
                </IconButton>
                <IconButton
                    label="Delete Workflow"
                    onClick={(e) => {onDelete(id); e.preventDefault(); e.stopPropagation();}}
                    size="large">
                    <BsTrash size={20}/>
                </IconButton>
            </div>

        </div>
    );
}
export default React.memo(AdvancedSquareCard)