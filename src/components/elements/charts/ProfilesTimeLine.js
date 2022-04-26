import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function ProfileTimeLine() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        asyncRemote({
            url: '/event/select/histogram',
            method: "post",
            data: {
                "minDate": {
                    "absolute": null,
                    "delta": {"type": "minus", "value": -1, "entity": "month"},
                    "now": null
                },
                "maxDate": {"absolute": null, "delta": null},
                "where": "",
                "limit": 30
            }
        }).then((resposne) => {
            if (resposne) {
                if (isSubscribed) setData(resposne?.data?.result)
            }
        }).catch(() => {

        }).finally(() => {
            if (isSubscribed) setLoading(false)
        })

        return () => isSubscribed = false;
    }, [])

    if (loading) {
        return <div><CenteredCircularProgress/></div>
    }

    return <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="2 1" vertical={false}/>
            <Tooltip isAnimationActive={false}/>
            <Bar
                dataKey="count"
                fill="#1976d2"

            />
            <XAxis dataKey="date" style={{fontSize: "80%"}}/>
            <YAxis style={{fontSize: "90%"}}/>

        </BarChart>
    </ResponsiveContainer>
}
