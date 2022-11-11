import React, {useState} from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import SessionStepper from "../steppers/SessionStepper";
import EventInfo from "./EventInfo";
import SessionCardInfo from "./SessionCardInfo";
import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";


export default function SessionDetails({data}) {

    const [eventId, setEventId] = useState(null);

    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Session time-line", "Raw Json"]}>
                <TabCase id={0}>
                    <div style={{display: "flex", width: "100%", height: "inherit", padding: 20, gap: 20}}>
                        <div style={{flex: "1 1 0", height: "inherit"}}>
                            <fieldset style={{padding: 10}}>
                                <legend>Session details</legend>
                                <SessionCardInfo session={data}/>
                            </fieldset>

                            <SessionStepper profileId={data?.profile?.id}
                                            session={data}
                                            onEventSelect={setEventId}
                            />
                        </div>
                        <div style={{flex: "1 1 0", height: "inherit", marginTop: 7}}>
                            {eventId && <EventInfo id={eventId} allowedDetails={['source', 'profile']}/>}
                        </div>
                    </div>
                </TabCase>
                <TabCase id={1}>
                    <div className="Box10">
                        <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;

}

SessionDetails.propTypes = {
    data: PropTypes.object,
};