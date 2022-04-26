import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function SessionCounter() {

    const [value,setValue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        asyncRemote({
            url: "session/count"
        }).then((resposne) => {
            if(resposne) {
                if(isSubscribed) setValue(resposne?.data?.count)
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
        <Counter label="Sessions" value={value}/>
    </div>
}