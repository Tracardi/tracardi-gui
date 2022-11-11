import React from "react";
import SessionSlider from "../sliders/SessionSlider";
import EventInfo from "./EventInfo";


export default function ProfileSessionsDetails({ profileId }) {

    const [eventId, setEventId] = React.useState(null);

    const handleEventSet = (eventId) => {
        setEventId(eventId);
    }

    return <div style={{display: "flex", width:"100%", height: "inherit", padding: 20, gap: 20}}>
        <div style={{flex: "1 1 0", height: "inherit"}}>
            <SessionSlider profileId={profileId}
                           onEventSelect={eventId => handleEventSet(eventId)}
            />
        </div>
        <div style={{flex: "1 1 0", height: "inherit"}}>
            {eventId && <EventInfo id={eventId} allowedDetails={['source']}/> }
        </div>
    </div>

}

