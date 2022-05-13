import React from "react";
import SessionSlider from "../sliders/SessionSlider";
import CompactEventDetails from "./CompactEventDetails";


export default function ProfileSessionsDetails({ profileId }) {

    const [eventId, setEventId] = React.useState(null);

    return <div style={{display: "flex", flexDirection: "row"}}>
        <SessionSlider profileId={profileId} onEventSelect={setEventId}/>
        <CompactEventDetails eventId={eventId} />
    </div>

}

