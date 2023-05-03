import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";

export default function InstancesCounter({width=180}) {

    const [value,setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(false);
        asyncRemote({
            url: "instances/count"
        }).then((response) => {
            if(response) {
                if(isSubscribed) setValue(response?.data?.count)
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
        <Counter label="Instances" value={value} width={width} hint="Running"/>
    </div>
}