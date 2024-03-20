import React, {useContext, useEffect, useState} from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useRequest} from "../../../remote_api/requestClient";
import {DataContext} from "../../AppBox";

export default function SessionCounter({width=200}) {

    const [value,setValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const dataContext = useContext(DataContext)

    const {request} = useRequest()

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        setError(false);
        request({
            url: "session/count"
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
    }, [dataContext])

    if(error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    if(loading) {
        return <CenteredCircularProgress />
    }

    return <Counter label="Sessions/Visits" value={value} hint="Stored" width={width}/>
}