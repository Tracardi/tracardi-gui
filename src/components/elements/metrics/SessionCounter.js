import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";

export default function SessionCounter() {

    const [value,setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        setError(false);
        asyncRemote({
            url: "session/count"
        }).then((resposne) => {
            if(resposne) {
                if(isSubscribed) setValue(resposne?.data?.count)
            }
        }).catch(() => {
            if (isSubscribed) setError(true);
        }).finally(() => {
            if(isSubscribed) setLoading(false)
        })

        return () => isSubscribed = false;
    }, [])

    if(error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    if(loading) {
        return <CenteredCircularProgress />
    }

    return <div>
        <Counter label="Sessions" value={value}/>
    </div>
}