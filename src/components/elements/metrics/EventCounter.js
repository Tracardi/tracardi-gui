import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function EventCounter() {

    const [value, setValue] = useState(0);
    const [avg, setAvg] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        asyncRemote({
            url: "event/count"
        }).then((resposne) => {
            if (resposne) {
                console.log(resposne.data)
                const NoOfEvents = resposne?.data?.count
                asyncRemote({
                    url: "event/avg/requests"
                }).then((resposne) => {
                    if (resposne) {
                        if (isSubscribed) {
                            setAvg(resposne?.data)
                            setValue(NoOfEvents)
                        }
                    }
                }).catch(() => {

                })
            }
        }).catch(() => {

        }).finally(() => {
            if (isSubscribed) setLoading(false)
        })



        return () => isSubscribed = false;
    }, [])

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <div>
        <Counter label="Events" value={value} subValue={avg} subValueSuffix="req./sec."/>
    </div>
}