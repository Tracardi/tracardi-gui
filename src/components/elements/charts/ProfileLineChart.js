import {Area, AreaChart, Line, LineChart, ResponsiveContainer} from "recharts";
import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function ProfileLineChart() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        asyncRemote({
            url: '/profile/select/histogram',
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
        return <div style={{width: 150, height: 130}}><CenteredCircularProgress/></div>
    }

    return <div style={{margin: 15}}>
        <AreaChart width={150} height={100} data={data}>
            <Area type="monotone" dataKey="count" stroke="#1976d2" fill="#e1f5fe" fillOpacity={0.3} strokeWidth={2}
                  dot={false}/>
        </AreaChart>
    </div>
}