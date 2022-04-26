import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function AvgEventTime({width=200}) {

    const [value,setValue] = useState(0);
    const [total,setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
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

        }).finally(() => {
            if(isSubscribed) setLoading(false)
        })

        return () => isSubscribed = false;
    }, [])

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