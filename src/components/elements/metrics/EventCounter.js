import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";

export default function EventCounter() {

    const [value, setValue] = useState(0);
    const [avg, setAvg] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(false);
        asyncRemote({
            url: "event/count"
        }).then((response) => {
            if (response) {
                const NoOfEvents = response?.data?.count
                asyncRemote({
                    url: "event/avg/requests"
                }).then((response) => {
                    if (response) {
                        if (isSubscribed) {
                            setAvg(response?.data)
                            setValue(NoOfEvents)
                        }
                    }
                }).catch(() => {

                })
            }
        }).catch(() => {
            if (isSubscribed) setError(true);
        }).finally(() => {
            if (isSubscribed) setLoading(false)
        })



        return () => isSubscribed = false;
    }, [])

    if(error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <div>
        <Counter label="Events" value={value} subValue={avg} subValueSuffix="events/s"/>
    </div>
}