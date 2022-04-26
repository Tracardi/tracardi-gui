import {Area, AreaChart, Line, LineChart, ResponsiveContainer} from "recharts";
import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function EventLineChart() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        setError(false)
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
            setError(true)
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
            <Area type="monotone" dataKey="count" stroke="#1976d2" fill="#e1f5fe" fillOpacity={0.3} strokeWidth={2}
                  dot={false}/>
        </AreaChart>
    </div>


}