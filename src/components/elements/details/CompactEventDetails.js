import React from "react";
import { object2dot } from "../../../misc/dottedObject";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./CompactEventDetails.css";

export default function CompactEventDetails({ eventId }) {

    const [event, setEvent] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [sessionContext, setSessionContext] = React.useState(null);

    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) setLoading(true);
        if (isSubscribed) setError(null);
        asyncRemote({
            url: "/event/" + eventId
        })
        .then(response => {if (isSubscribed) {setEvent(response.data.event); return response.data.event.session.id;}})
        .then(sessionId => 
            asyncRemote({url: "/session/" + sessionId})
            .then(response => {if (isSubscribed) setSessionContext(response.data.context)})
            .catch(e => {if (isSubscribed) setError(getError(e))})
        )
        .catch(e => { if (isSubscribed) setError(getError(e))})
        .finally(() => setLoading(false))
        return () => isSubscribed = false;
    }, [eventId])

    const EventInfoField = ({name, content}) => {
        return (
            <div
                style={{
                    overflow: "none",
                    overflowWrap: "anywhere",
                    paddingTop: "15px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    fontSize: "16px",
                    fontWeight: 400
                }}
            >
                <div style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    maxWidth: "80px",
                    minWidth: "80px",
                    }}
                >
                    {name}
                </div>
                <div style={{fontSize: "14px"}}>{typeof content === "object" ? content : content.toString()}</div>
            </div>
        );
    }

    const EventProperties = () => {
        const eventProperties = object2dot(event.properties);
        return <>{Object.keys(eventProperties).map(key => <EventInfoField key={key} name={key} content={eventProperties[key]}/>)}</>
    }

    return <>
        <div style={{minHeight: "700px", maxHeight: "700px", minWidth: "350px", maxWidth: "350px", margin: 10, marginLeft: 0}}>
            {loading ? 
                <CenteredCircularProgress />
                :
                <div style={{margin: 10}}>
                {error && <ErrorsBox errorList={error} />}
                {!error &&
                    <div>
                        <div style={{maxHeight: "60px", minHeight: "60px", display: "flex", flexDirection: "column", alignItems: 'flex-start', marginLeft: 10}}>
                            <header>{`Event type ${event.type}`}</header>
                            <header>{`Happened at ${event.metadata.time.insert.substr(11, 8)}`}</header>
                        </div>
                        <div className="CompactEventData" style={{maxHeight: "620px", overflow: "auto", borderTop: "1px solid lightgrey", borderBottom: "1px solid lightgrey", paddingBottom: 10}}>
                            <div style={{margin: 10}}>
                                <header style={{fontWeight: 400, borderBottom: "1px solid lightgrey", fontSize: 17}}>Properties</header>
                                {event?.properties && <EventProperties />}
                                <header style={{fontWeight: 400, borderBottom: "1px solid lightgrey", fontSize: 17, marginTop: 25}}>Context</header>
                                {event?.metadata?.ip || event?.context?.ip && <EventInfoField name="IP" content={event?.metadata?.ip || event?.context?.ip} />}
                                {event?.context?.page?.url && <EventInfoField name="URL" content={event.context.page.url}/>}
                                <header style={{fontWeight: 400, marginTop: 25, borderBottom: "1px solid lightgrey", fontSize: 17}}>User info</header>
                                {sessionContext?.time?.tz &&
                                    <EventInfoField name="Timezone" content={sessionContext.time.tz} />
                                }
                                {sessionContext?.browser?.local?.browser?.language &&
                                    <EventInfoField name="Language" content={sessionContext.browser.local.browser.language} />
                                }
                                <header style={{fontWeight: 400, marginTop: 25, borderBottom: "1px solid lightgrey", fontSize: 17}}>Device</header>
                                {sessionContext?.screen?.local?.width && sessionContext?.screen?.local?.height &&
                                    <EventInfoField name="Resolution" content={`${sessionContext.screen.local.width}x${sessionContext.screen.local.height}`}/>
                                }
                                {sessionContext?.browser?.local?.device?.platform &&
                                    <EventInfoField name="Platform" content={sessionContext.browser.local.device.platform} />
                                }
                            </div>
                        </div>
                    </div>
                } 
                </div>
            }
        </div>
    </>
}