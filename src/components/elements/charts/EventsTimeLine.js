import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {BsCalendarDay, BsCalendarMonth, BsCalendar3} from "react-icons/bs";
import Button from "../forms/Button";
import LinearProgress from "@mui/material/LinearProgress";
import DropDownMenu from "../../menu/DropDownMenu";

export default function EventTimeLine() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [period, setPeriod] = useState("month")
    const [grouping, setGrouping] = useState("type");
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(false);
    const [dataSource, setDataSource] = useState("event")

    const colorsList = [
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

    const statusColors = {
        collected: '#0088FE',
        processed: '#00C49F',
        error: "#d81b60"
    }

    const getColor = (idx) => {
        if (colorsList.length <= idx) {
            return "#1976d2"
        }
        return colorsList[idx]
    }

    const getStatusColor = (idx, item) => {
        if (!(item in statusColors)) {
            return "#888"
        }
        return statusColors[item]
    }

    const getUrl = (source, defaultGrouping) => {
        if (defaultGrouping) {
            return `${source}?group_by=${defaultGrouping}`
        }

        return source
    }

    const getSessionGrouping = (grouping) => {
        switch (grouping) {
            case "timezone":
                return {
                    group: 'context.time.tz.keyword',
                    colors: getColor,
                }
            case "platform":
                return {
                    group: 'context.browser.local.device.platform.keyword',
                    colors: getColor,
                }
            default:
                return {
                    group: 'context.browser.local.browser.name.keyword',
                    colors: getColor,
                }
        }

    }

    const getEventGrouping = (grouping) => {
        switch (grouping) {

            case "rule":
                return {
                    group: 'metadata.processed_by.rules',
                    colors: getColor,
                }
            case "status":
                return {
                    group: 'metadata.status',
                    colors: getStatusColor,
                }
            case "tag":
                return {
                    group: 'tags.values',
                    colors: getColor,
                }
            case "source":
                return {
                    group: 'source.id',
                    colors: getColor,
                }
            default:
                return {
                    group: 'type',
                    colors: getColor,
                }
        }
    }

    const getDataSource = (dataSource, grouping) => {
        let groupConfig = null
        switch (dataSource) {
            case "profile":
                return {
                    source: getUrl('/profile/select/histogram'),
                    groupings: null,
                    colors: getColor
                }
            case "session":
                groupConfig = getSessionGrouping(grouping)
                return {
                    source: getUrl('/session/select/histogram', groupConfig.group),
                    groupings: <>
                        <Button style={{width: 120}} label="time zone" onClick={() => setGrouping("timezone")}
                                selected={grouping === 'timezone'}/>
                        <Button style={{width: 120}} label="browser" onClick={() => setGrouping("browser")}
                                selected={grouping === 'browser'}/>
                        <Button style={{width: 120}} label="platform" onClick={() => setGrouping("platform")}
                                selected={grouping === 'platform'}/>

                    </>,
                    colors: groupConfig.colors
                }
            default:
                groupConfig = getEventGrouping(grouping)
                return {
                    source: getUrl('/event/select/histogram', groupConfig.group),
                    groupings: <>
                        <Button style={{width: 100}} label="type" onClick={() => setGrouping("type")}
                                selected={grouping === 'type'}/>
                        <Button style={{width: 100}} label="status" onClick={() => setGrouping("status")}
                                selected={grouping === 'status'}/>
                        <Button style={{width: 100}} label="source" onClick={() => setGrouping("source")}
                                selected={grouping === 'source'}/>
                        <Button style={{width: 100}} label="route" onClick={() => setGrouping("rule")}
                                selected={grouping === 'rule'}/>
                        <Button style={{width: 100}} label="tag" onClick={() => setGrouping("tag")}
                                selected={grouping === 'tag'}/>
                    </>,
                    colors: groupConfig.colors
                }
        }
    }

    useEffect(() => {
        let isSubscribed = true;
        if (loading === null) {
            setLoading(true)
        } else setProgress(true);
        setError(false);
        const dataSourceConfig = getDataSource(dataSource, grouping)
        asyncRemote({
            url: dataSourceConfig.source,
            method: "post",
            data: {
                "minDate": {
                    "absolute": null,
                    "delta": {"type": "minus", "value": -1, "entity": period ? period : "month"},
                    "now": null
                },
                "maxDate": {"absolute": null, "delta": null},
                "where": "",
                "timeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "limit": 30
            }
        }).then((response) => {
            if (response) {
                if (isSubscribed) setData(response?.data)
            }
        }).catch(() => {
            if (isSubscribed) setError(true)
        }).finally(() => {
            if (isSubscribed) {
                setLoading(false)
                setProgress(false)
            }
        })

        return () => isSubscribed = false;
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [period, grouping, dataSource])

    if (loading) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    const dataSourceConfig = getDataSource(dataSource, grouping)

    return <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
        <div style={{padding: "0 10px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <DropDownMenu label={dataSource}
                              selected={true}
                              width={150}
                              options={{
                                  "Events time-line": () => {
                                      setDataSource('event');
                                      setGrouping('type');  // Default grouping
                                  },
                                  "Profiles time-line": () => {
                                      setDataSource('profile');
                                      setGrouping(null);
                                  },
                                  "Sessions time-line": () => {
                                      setDataSource('session');
                                      setGrouping('browser');
                                  },
                              }}/>
                {dataSourceConfig.groupings}
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <Button label="Last day" onClick={() => setPeriod("day")}
                            selected={period === "day"} icon={<BsCalendarDay size={20}/>}/>
                <Button label="Last month" onClick={() => setPeriod("month")}
                        selected={period === "month"} icon={<BsCalendarMonth size={20}/>}/>
                <Button label="Last year" onClick={() => setPeriod("year")}
                        selected={period === "year"} icon={<BsCalendar3 size={20}/>}/>
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
                                 stroke={dataSourceConfig.colors(index, column)}
                                 fillOpacity={.6}
                                 fill={dataSourceConfig.colors(index, column)}
                    />
                })}
                <XAxis dataKey="date" style={{fontSize: "80%"}}/>
                <YAxis style={{fontSize: "90%"}}/>
            </AreaChart>
        </ResponsiveContainer>
        {progress && <LinearProgress/>}
    </div>
}
