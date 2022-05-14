import React from "react";
import SessionSlider from "../sliders/SessionSlider";
import EventInfo from "./EventInfo";


export default function ProfileSessionsDetails({ profileId }) {

    const [eventId, setEventId] = React.useState(null);

    return <div style={{display: "flex", width:"100%"}}>
        <div style={{width: "100%", paddingRight: 10, flexBasis: "40%"}}>
            <SessionSlider profileId={profileId} onEventSelect={setEventId}/>
        </div>
        <div style={{width: "100%", paddingLeft: 10, flexBasis: "60%"}}>
            {eventId && <EventInfo id={eventId} />}
        </div>
    </div>

}

