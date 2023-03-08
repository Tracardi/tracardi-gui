import React from "react";
import NoData from "../misc/NoData";
import Button from "../forms/Button";
import {MdUnfoldLess, MdUnfoldMore} from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";
import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import {useFetch} from "../../../remote_api/remoteState";
import {getSessionById} from "../../../remote_api/endpoints/session";
import FetchError from "../../errors/FetchError";

const SessionContextData = ({sessionId}) => {
    const {isLoading, data, error} = useFetch(
        ["session", [sessionId]],
        getSessionById(sessionId),
        (data) => {
            return data
        }
    )
    if (isLoading) {
        return <div style={{marginTop: 10}}><LinearProgress/></div>
    }

    if (error) {
        if (error.status === 404) {
            return <NoData header="Missing session">This event has no session. Can not retrieve context data.</NoData>
        }
        return <FetchError error={error}/>
    }

    return <div style={{padding: 20}}>
        <ObjectInspector data={data.context} theme={theme} expandLevel={4}/>
    </div>
}

const SessionContextInfo = ({sessionId}) => {

    const [displaySessionContext, setDisplaySessionContext] = React.useState(false);

    if (!displaySessionContext) {
        return <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Button label="Display session context"
                    icon={<MdUnfoldMore size={20}/>}
                    onClick={() => setDisplaySessionContext(true)}/>
        </div>
    }

    return <div>
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Button
                label="Hide session context"
                icon={<MdUnfoldLess size={20}/>}
                onClick={() => setDisplaySessionContext(false)}/>
        </div>
        <SessionContextData sessionId={sessionId}/>
    </div>

};

export default SessionContextInfo;