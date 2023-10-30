import React, {useEffect, useState} from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useRequest} from "../../../remote_api/requestClient";

export default function EntityCounter({width=200}) {

    const [value,setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const {request} = useRequest()

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(false);
        request({
            url: "entity/count"
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
        <Counter label="Entities" value={value} width={width} hint="Stored"/>
    </div>
}