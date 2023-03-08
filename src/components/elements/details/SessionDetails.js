import React, {useState} from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import SessionStepper from "../steppers/SessionStepper";
import EventInfo from "./EventInfo";
import SessionCardInfo from "./SessionCardInfo";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import JsonBrowser from "../misc/JsonBrowser";
import {useFetch} from "../../../remote_api/remoteState";
import {getSessionById} from "../../../remote_api/endpoints/session";


export default function SessionDetails({data: session}) {

    const [eventId, setEventId] = useState(null);

    return <div style={{height: "inherit"}}>
        <div className="RightTabScroller">
            <Tabs tabs={["Session time-line", "Raw Json"]}>
                <TabCase id={0}>
                    <div style={{display: "flex", width: "100%", height: "inherit", padding: 20, gap: 20}}>
                        <div style={{flex: "1 1 0", height: "inherit"}}>
                            <fieldset style={{padding: 10}}>
                                <legend>Session details</legend>
                                <SessionCardInfo session={session}/>
                            </fieldset>

                            <SessionStepper profileId={session?.profile?.id}
                                            session={session}
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
                        <JsonBrowser data={session}/>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;
}

export function SessionDetailsById({id}) {

    const query = useFetch(
        ["getSession", [id]],
        getSessionById(id),
        data => {
            return data
        })

    if(query.isError) {
        if(query.error.status === 404)
            return <NoData header="Could not find session.">
                This can happen if the session was deleted or archived.
            </NoData>
        return <NoData header={`Error ${query.error.status }.`}>
            {query.error.statusText}
        </NoData>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <SessionDetails data={query.data}/>}
    </>
}

SessionDetails.propTypes = {
    data: PropTypes.object,
};

SessionDetailsById.propTypes = {
    id: PropTypes.string,
};