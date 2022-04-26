import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";

export default function AvgEventTime({width=200}) {

    const [value,setValue] = useState(0);
    const [total,setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(false);
        asyncRemote({
            url: "event/avg/process-time"
        }).then((resposne) => {
            if(resposne) {
                if(isSubscribed) {
                    setValue(resposne?.data?.avg);
                    setTotal(resposne?.data?.records)
                }
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
        <Counter label="Avg process time"
                 value={value}
                 subValue={total}
                 subValueSuffix="records"
                 width={width}/>
    </div>
}