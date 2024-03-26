import React, {useContext} from "react";
import {BigCounter} from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getOnlineSessions, getOnlineSessionsByLocation} from "../../../remote_api/endpoints/session";
import PropertyField from "../details/PropertyField";
import {DataContext} from "../../AppBox";
import {isNotEmptyArray} from "../../../misc/typeChecking";

export default function OnlineSessionCounter() {
    const dataContext = useContext(DataContext)

    const {data: online, isLoading: isLoadingOnline, error: onlineError} = useFetch(
        ["onlineSessions", [dataContext]],
        getOnlineSessions(),
        data => data,
        {
            refetchInterval: 30*1000
        }
    )

    const {data: details, isLoading: isLoadingDetails, error: detailsError} = useFetch(
        ["onlineSessionsLocation", [dataContext]],
        getOnlineSessionsByLocation(),
        data => data,
        {
            refetchInterval: 30*1000
        }
    )

    if(onlineError || detailsError) {
        return <NoData header="Error" iconColor="rgba(255,255,255,0.7)">
            Could not load data.
        </NoData>
    }

    if(isLoadingDetails || isLoadingOnline) {
        return <CenteredCircularProgress />
    }

    return <div style={{display: "flex"}}>
        <div style={{minWidth: 265}}>
            <BigCounter label="Online Sessions"
                        value={online.sessions}
                        hint={<span>Calculated from <b>{online.events}</b> online events</span>}
            />
        </div>
        <div style={{padding: 15, width: "100%"}}>
            {isNotEmptyArray(details.tz) && <PropertyField name="Time Zones" content="No of events in 15m" valueAlign="flex-end"/>}
            {details.tz.map((item, index) => {
                return <PropertyField key={`tz-${index}`} name={item.name} content={item.count} valueAlign="flex-end"/>
            })}
    </div>
        </div>
}