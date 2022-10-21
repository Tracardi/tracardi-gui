import React, {useState} from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import SessionStepper from "../steppers/SessionStepper";
import EventInfo from "./EventInfo";


export default function SessionDetails({data}) {

    const [eventId, setEventId] = useState(null);

    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Session time-line"]}>
                <TabCase id={0}>
                    <div style={{display: "flex", width: "100%", height: "inherit", padding: 5}}>
                        <div style={{width: "100%", padding: 5, flexBasis: "40%", height: "inherit"}}>
                            <SessionStepper profileId={data?.profile?.id}
                                            session={data}
                                            onEventSelect={setEventId}
                            />
                        </div>
                        <div style={{width: "100%", padding: 5, flexBasis: "60%", height: "inherit"}}>
                            {eventId && <EventInfo id={eventId} allowedDetails={['source', 'profile']}/>}
                        </div>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

SessionDetails.propTypes = {
    data: PropTypes.object,
};