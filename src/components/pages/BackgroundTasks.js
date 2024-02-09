import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BackgroundTaskProgress from "../elements/misc/BackgroundTaskProgress";
import {IoRefreshCircle} from "react-icons/io5";
import Button from "../elements/forms/Button";
import EventJourneyTag from "../elements/misc/EventJourneyTag";

export default function BackgroundTasks({type=null}) {

    const [refresh, setRefresh] = useState(0);
    const urlFunc = useCallback((query) => {
        if(type) {
            return '/tasks/type/' + type + ((query) ? "?query=" + query : "")
        }
        return '/tasks' + ((query) ? "?query=" + query : "")
    }, [type]);
    const actionFunc = useCallback( (id, data, onDelete) => {
        return <div style={{width: 200, margin: "2px 10px"}}>
            <BackgroundTaskProgress taskId={id}/>
        </div>
    }, [])
    const descFunc = useCallback((row) => <EventJourneyTag>{row.timestamp}</EventJourneyTag>, [])

    const RefreshButton = () => {

        return <Button label="Refresh"
                       icon={<IoRefreshCircle size={20}/>}
                       onClick={() => setRefresh(refresh + 1)}
        />
    }

    return <div style={{display: "grid", gridTemplateRows: "40px calc(100% - 40px)"}}>
        <div style={{display: "flex", justifyContent: "flex-end", margin: "0 15px"}}><RefreshButton/></div>
        <CardBrowser
            label="Background tasks"
            defaultLayout="rows"
            description="List of running and completed background tasks."
            urlFunc={urlFunc}
            className="Pad10"
            forceMode="no-deployment"
            descriptionFunc={descFunc}
            actionFunc={actionFunc}
            icon="store"
        /></div>
}
