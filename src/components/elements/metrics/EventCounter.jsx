import React, {useContext} from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getEventsAvg, getEventsCount} from "../../../remote_api/endpoints/event";
import storageValue from "../../../misc/localStorageDriver";
import {DataContext} from "../../AppBox";

export default function EventCounter({width=200}) {
    const dataContext = useContext(DataContext)

    const {data: eventCount, isLoading, error} = useFetch(
        ["eventCount", [dataContext]],
        getEventsCount(),
        data => {
            new storageValue("events").save(data?.count)
            return data?.count
        }
    )

    const {data: eventAvg} = useFetch(
        ["eventAvg"],
        getEventsAvg(),
        data => {
            new storageValue("avgEvents").save(data)
            return data
        }
    )

    if(error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return <Counter label="Events" value={eventCount} subValue={eventAvg} subValueSuffix="events/s" width={width}/>
}