import React from 'react';
import "./Card.css";
import "./EventCard.css";

export default function EventCard({data, onClick}) {

    return (
        <div onClick={(ev)=>{onClick(data.eventId)}} className="Card">
            <span className="Avatar EventAvatar">E</span>
            <span className="scope">{data.scope}</span>
            <span className="type">{data.type}</span>
            <span className="timestamp">{data.timestamp}</span>
        </div>
    );
}

