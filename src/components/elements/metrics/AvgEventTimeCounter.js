import React, {useEffect, useState} from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useRequest} from "../../../remote_api/requestClient";

export default function AvgEventTime({width=160}) {

    const [value,setValue] = useState(0);
    const [total,setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const {request} = useRequest()

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        setError(false);
        request({
            url: "/event/avg/process-time"
        }).then((response) => {
            if(response) {
                if(isSubscribed) {
                    setValue(response?.data?.avg);
                    setTotal(response?.data?.records)
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