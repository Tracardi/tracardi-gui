import React from 'react';
import "./SquareCard.css";

const SquareCard = ({id, status, name, description, onClick, icon}) => {
    const statusClass = (status) => {
        return status ? "icon enabled" : "icon disabled"
    }

    return (
        <div onClick={(ev) => {onClick(id)}} className="SquareCard">
            <div className={statusClass(status)}>{icon}</div>
            <div className="name">{name}</div>
            <div className="desc">{description}</div>
        </div>
    );
}
export default React.memo(SquareCard)