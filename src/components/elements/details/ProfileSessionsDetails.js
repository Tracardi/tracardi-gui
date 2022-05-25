import React from "react";
import SessionSlider from "../sliders/SessionSlider";
import EventInfo from "./EventInfo";
// import NoData from "../misc/NoData";


export default function ProfileSessionsDetails({ profileId }) {

    const [eventId, setEventId] = React.useState(null);
    // const [empty, setEmpty] = React.useState(false);

    const handleEventSet = (eventId) => {
        setEventId(eventId);
        // setEmpty(false);
    }

    // if (empty === true) {
    //     return <div style={{height: "inherit", display: "flex", alignItems: "center", justifyContent: "center"}}>
    //         <NoData header="There are no events and sessions for this profile." fontSize="16px"/>
    //     </div>
    // }

    return <div style={{display: "flex", width:"100%", height: "inherit", padding: 5}}>
        <div style={{width: "100%", padding: 5, flexBasis: "40%", height: "inherit"}}>
            <SessionSlider profileId={profileId}
                           onEventSelect={eventId => handleEventSet(eventId)}
            />
        </div>
        <div style={{width: "100%", padding: 5, flexBasis: "60%", height: "inherit"}}>
            {eventId && <EventInfo id={eventId} /> }
        </div>
    </div>

}

