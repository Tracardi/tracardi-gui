import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import Button from "../forms/Button";
import LinearProgress from "@mui/material/LinearProgress";
import DropDownMenu from "../../menu/DropDownMenu";
import EventCounter from "../metrics/EventCounter";
import SessionCounter from "../metrics/SessionCounter";
import ProfileCounter from "../metrics/ProfileCounter";
import InstancesCounter from "../metrics/InstancesCounter";
import AvgEventTime from "../metrics/AvgEventTimeCounter";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function EventTimeLine() {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(null)
    const [period, setPeriod] = useState("month")
    const [grouping, setGrouping] = useState("type");
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(false);
    const [dataSource, setDataSource] = useState("event")
    const [dataSelect, setDataSelect] = useState(1)

    const colorsList = [
        '#0088FE',
        '#1D4ED8',
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
                        <Button style={{width: 80}} label="zone" onClick={() => setGrouping("timezone")}
                                selected={grouping === 'timezone'} variant="standard"/>
                        <Button style={{width: 80}} label="browser" onClick={() => setGrouping("browser")}
                                selected={grouping === 'browser'} variant="standard"/>
                        <Button style={{width: 80}} label="platform" onClick={() => setGrouping("platform")}
                                selected={grouping === 'platform'} variant="standard"/>

                    </>,
                    colors: groupConfig.colors
                }
            default:
                groupConfig = getEventGrouping(grouping)
                return {
                    source: getUrl('/event/select/histogram', groupConfig.group),
                    groupings: <>
                        <Button style={{width: 80}} label="type" onClick={() => setGrouping("type")}
                                selected={grouping === 'type'} variant="standard"/>
                        <Button style={{width: 80}} label="status" onClick={() => setGrouping("status")}
                                selected={grouping === 'status'} variant="standard"/>
                        <Button style={{width: 80}} label="source" onClick={() => setGrouping("source")}
                                selected={grouping === 'source'} variant="standard"/>
                        <Button style={{width: 80}} label="tag" onClick={() => setGrouping("tag")}
                                selected={grouping === 'tag'} variant="standard"/>
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

        <div style={{padding: "10px 20px 20px 20px", marginBottom: 10, display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", boxShadow: "0px 8px 14px -15px rgba(66, 68, 90, 1)"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <Select
                    disableUnderline
                    label="Type"
                    size="small"
                    variant="standard"
                    value={dataSelect}
                    style={{marginRight: 10}}
                    onChange={(ev) => {
                        switch (ev.target.value) {
                            case 1:
                                setDataSelect(1);
                                setDataSource('event');
                                setGrouping('type');  // Default grouping
                                break;
                            case 2:
                                setDataSelect(2);
                                setDataSource('profile');
                                setGrouping(null);
                                break;
                            case 3:
                                setDataSelect(3);
                                setDataSource('session');
                                setGrouping('browser');
                                break;
                        }
                    }}
                >
                    <MenuItem value={1}>Events time-line</MenuItem>
                    <MenuItem value={2}>Profiles time-line</MenuItem>
                    {/*<MenuItem value={3}>Session time-line</MenuItem>*/}
                </Select>

                {dataSourceConfig.groupings}
            </div>
            <div style={{display: "flex", alignItems: "center"}}>
                <Button label="Last hour" onClick={() => setPeriod("hour")}
                        selected={period === "hour"} variant="standard"/>
                <Button label="Last day" onClick={() => setPeriod("day")}
                            selected={period === "day"} variant="standard"/>
                <Button label="Last month" onClick={() => setPeriod("month")}
                        selected={period === "month"} variant="standard"/>
                <Button label="Last year" onClick={() => setPeriod("year")}
                        selected={period === "year"} variant="standard"/>
            </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", flexWrap: "wrap", flexDirection: "row", margin: 10}}>
            <EventCounter/>
            <SessionCounter/>
            <ProfileCounter/>
            <InstancesCounter/>
            <AvgEventTime/>
        </div>
        {progress ? <LinearProgress/> : <div style={{height: 4}}></div>}
        <div style={{ padding: "10px 80px 40px 40px"}}>
                <ResponsiveContainer height={240}>
                    <AreaChart data={data?.result}>
                        <defs>
                            {colorsList.map((item, idx) => {
                                return <linearGradient key={idx} id={item.replace("#","c")} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={item} stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                                </linearGradient>
                            })}

                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} color="#ccc"/>
                        <Tooltip isAnimationActive={false}/>
                        {data?.buckets?.map((column, index) => {
                            return <Area key={index}
                                         type="monotone"
                                         stackId="stack"
                                         dataKey={column}
                                         strokeWidth={3}
                                         stroke={dataSourceConfig.colors(index, column)}
                                         fillOpacity={.2}
                                         fill={`url(#${dataSourceConfig.colors(index, column).replace("#","c")})`}
                            />
                        })}
                        <XAxis dataKey="date" style={{fontSize: "100%"}}/>
                        {/*<YAxis style={{fontSize: "100%"}}/>*/}
                    </AreaChart>
                </ResponsiveContainer>
        </div>



    </div>
}
