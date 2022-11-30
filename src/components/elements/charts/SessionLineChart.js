import {Area, AreaChart} from "recharts";
import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function SessionLineChart() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        setError(false);
        asyncRemote({
            url: '/session/select/histogram',
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
        }).then((response) => {
            if (response) {
                if (isSubscribed) setData(response?.data?.result)
            }
        }).catch(() => {
            setError(true);
        }).finally(() => {
            if (isSubscribed) setLoading(false)
        })

        return () => isSubscribed = false;
    }, [])

    if(error) {
        return ""
    }

    if (loading) {
        return <div style={{width: 150, height: 110}}><CenteredCircularProgress/></div>
    }

    return <div style={{margin: 15}}>
        <AreaChart width={150} height={80} data={data}>
            <Area type="monotone" dataKey="count" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} strokeWidth={2}
                  dot={false}/>
        </AreaChart>
    </div>
}