import React from 'react';
import "./SquareCard.css";
import Tag from "../../misc/Tag";

const SquareCard = ({id, status, name, description, onClick, icon, tags}) => {
    const statusClass = (status) => {
        if(typeof status === 'undefined') {
            return status
        }
        return status ? "icon enabled" : "icon disabled"
    }

    return (
        <div onClick={(ev) => {onClick(id)}} className="SquareCard">
            <div className={statusClass(status)}>{icon}</div>
            <div className="name">{name}</div>
            <div className="desc">{description}</div>
            {tags && <div className="tags">{Array.isArray(tags) && tags.map((tag, key) => <Tag id={key}>{tag}</Tag>) }</div>}
        </div>
    );
}
export default React.memo(SquareCard)