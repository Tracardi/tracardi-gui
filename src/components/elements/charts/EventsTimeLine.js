import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {BsCalendarDay, BsCalendarMonth, BsCalendar3} from "react-icons/bs";
import IconButton from "../misc/IconButton";

export default function EventTimeLine() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [period, setPeriod] = useState("month")
    const [error, setError] = useState(false);

    const barChartColors = [
        '#0088FE',
        '#00C49F',
        '#FFBB28',
        '#FF8042',
        "#00bcd4",
        "#03a9f4",
        "#009688",
        "#8bc34a",
        "#4caf50",
        "#f44336",
        "#ff9800"

    ]

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        setError(false);
        asyncRemote({
            url: '/event/select/histogram?group_by=type',
            method: "post",
            data: {
                "minDate": {
                    "absolute": null,
                    "delta": {"type": "minus", "value": -1, "entity": period ? period : "month"},
                    "now": null
                },
                "maxDate": {"absolute": null, "delta": null},
                "where": "",
                "limit": 30
            }
        }).then((resposne) => {
            if (resposne) {
                if (isSubscribed) setData(resposne?.data)
            }
        }).catch(() => {
            if (isSubscribed) setError(true)
        }).finally(() => {
            if (isSubscribed) setLoading(false)
        })

        return () => isSubscribed = false;
    }, [period])

    if (loading) {
        return <div><CenteredCircularProgress/></div>
    }

    const getColor = (idx) => {
        if (barChartColors.length <= idx) {
            return "#1976d2"
        }
        return barChartColors[idx]
    }

    if (error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    return <>
        <div style={{padding: "10px 10px 0 10px", display: "flex", justifyContent: "space-between"}}>
            <header>Event type time-line</header>
            <div>
                <IconButton label="Last day" onClick={() => setPeriod("day")} selected={period==="day"}><BsCalendarDay size={24}/></IconButton>
                <IconButton label="Last Month" onClick={() => setPeriod("month")} selected={period==="month"}><BsCalendarMonth
                    size={24}/></IconButton>
                <IconButton label="Last year" onClick={() => setPeriod("year")} selected={period==="year"}><BsCalendar3 size={24}/></IconButton>
            </div>
        </div>
        <ResponsiveContainer height={200}>
            <AreaChart data={data?.result}>
                <CartesianGrid strokeDasharray="2 1" vertical={false}/>
                <Tooltip isAnimationActive={false}/>
                {data?.buckets?.map((column, index) => {
                    return <Area key={index}
                                 type="monotone"
                                 stackId="stack"
                                 dataKey={column}
                                 strokeWidth={0}
                                 stroke={getColor(index)}
                                 fillOpacity={.6}
                                 fill={getColor(index)}
                    />
                })}
                <XAxis dataKey="date" style={{fontSize: "80%"}}/>
                <YAxis style={{fontSize: "90%"}}/>

            </AreaChart>
        </ResponsiveContainer>
    </>
}
