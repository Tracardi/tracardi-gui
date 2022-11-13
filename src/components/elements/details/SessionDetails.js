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
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";


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
                        <ObjectInspector data={session} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs>

        </div>
    </div>;
}

export function SessionDetailsById({id}) {

    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [noData, setNoData] = React.useState(false);

    React.useEffect(() => {
        let isSubscribed = true;
        setNoData(false)
        setError(null);
        setLoading(true);
        if (id) {
            asyncRemote({
                url: "/session/" + id
            })
                .then(response => setSession(response.data))
                .catch(e => {
                    if(isSubscribed) {
                        if(e.request && e.request.status === 404) {
                            setNoData(true)
                        } else {
                            setError(getError(e))
                        }
                    }
                })
                .finally(() => {if(isSubscribed) setLoading(false)})
        }
        return () => isSubscribed = false;
    }, [id])

    if(noData) {
        return <NoData header="Could not find session.">
            This can happen if the session was deleted or archived.
        </NoData>
    }

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {session && <SessionDetails data={session}/>}
    </>
}

SessionDetails.propTypes = {
    data: PropTypes.object,
};

SessionDetailsById.propTypes = {
    id: PropTypes.string,
};