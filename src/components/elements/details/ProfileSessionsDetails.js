import React from "react";
import SessionSlider from "../sliders/SessionSlider";
import EventInfo from "./EventInfo";


export default function ProfileSessionsDetails({ profileId }) {

    const [eventId, setEventId] = React.useState(null);

    const handleEventSet = (eventId) => {
        setEventId(eventId);
    }

    return <div style={{display: "flex", width:"100%", height: "inherit", padding: 5}}>
        <div style={{width: "100%", padding: 5, flexBasis: "40%", height: "inherit"}}>
            <SessionSlider profileId={profileId}
                           onEventSelect={eventId => handleEventSet(eventId)}
            />
        </div>
        <div style={{width: "100%", padding: 5, flexBasis: "60%", height: "inherit"}}>
            {eventId && <EventInfo id={eventId} allowedDetails={['source']}/> }
        </div>
    </div>

}

