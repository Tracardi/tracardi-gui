import React, {useEffect, useState} from "react";
import TuiPieChart from "../elements/charts/PieChart";
import {asyncRemote} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ProfileCounter from "../elements/metrics/ProfileCounter";
import SessionCounter from "../elements/metrics/SessionCounter";
import EventCounter from "../elements/metrics/EventCounter";
import EventLineChart from "../elements/charts/EventLineChart";
import ProfileLineChart from "../elements/charts/ProfileLineChart";
import InstancesCounter from "../elements/metrics/InstancesCounter";
import MetricTimeLine from "../elements/metrics/MetricTimeLine";
import SessionLineChart from "../elements/charts/SessionLineChart";
import AvgEventTime from "../elements/metrics/AvgEventTimeCounter";
import EventTimeLine from "../elements/charts/EventsTimeLine";

export default function Dashboard() {

    const [eventsByType, setEventsByType] = useState([]);
    const [eventsByTag, setEventsByTag] = useState([]);
    const [eventsBySource, setEventsBySource] = useState([]);
    const [loadingByType, setLoadingByType] = useState(false);
    const [loadingByTag, setLoadingByTag] = useState(false);
    const [loadingBySource, setLoadingBySource] = useState(false);

    useEffect(() => {
        setLoadingByType(true);
        asyncRemote({
            url: "events/by_type"
        }).then((resposne) => {
            if (resposne) {
                setEventsByType(resposne.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByType(false)
        })
    }, [])

    useEffect(() => {
        setLoadingByTag(true);
        asyncRemote({
            url: "events/by_tag"
        }).then((resposne) => {
            if (resposne) {
                setEventsByTag(resposne.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByTag(false)
        })
    }, [])

    useEffect(() => {
        setLoadingBySource(true);
        asyncRemote({
            url: "events/by_source"
        }).then((resposne) => {
            if (resposne) {
                setEventsBySource(resposne.data);
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingBySource(false)
        })
    }, [])

    const PieChart = ({loading, data, header, subHeader=null, fill = "#1976d2"}) => {
        return <div style={{paddingTop: 20}}>
            {header && <header style={{display: "flex", justifyContent: "center"}}>{header}</header>}
            {subHeader && <header style={{display: "flex", justifyContent: "center", fontSize: "70%"}}>{subHeader}</header>}
            <div style={{width: 280, height: 200}}>
                {!loading && <TuiPieChart data={data} fill={fill}/>}
                {loading && <CenteredCircularProgress/>}
            </div>
        </div>

    }

    return <div
        style={{display: "flex", flexDirection: "column", padding: 20, height: "100%"}}>
        <div style={{display: "flex", flexWrap: "wrap"}}>
            <MetricTimeLine>
                <InstancesCounter/>
            </MetricTimeLine>
            <MetricTimeLine>
                <AvgEventTime/>
            </MetricTimeLine>
            <MetricTimeLine>
                <EventCounter/>
                <EventLineChart/>
            </MetricTimeLine>
            <MetricTimeLine>
                <ProfileCounter/>
                <ProfileLineChart/>
            </MetricTimeLine>
            <MetricTimeLine>
                <SessionCounter/>
                <SessionLineChart/>
            </MetricTimeLine>
        </div>
        <MetricTimeLine fitContent={false}>
            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                <div style={{width: "100%", height: 270, padding: 10}}>
                    <EventTimeLine/>
                </div>
            </div>

        </MetricTimeLine>

        <div style={{display: "flex", flexDirection: "row"}}>

            <MetricTimeLine><PieChart header="No of events" subHeader="by type" loading={loadingByType}
                                      data={eventsByType}/></MetricTimeLine>
            <MetricTimeLine><PieChart header="No of events" subHeader="by type" loading={loadingByTag}
                                      data={eventsByTag}/></MetricTimeLine>
            <MetricTimeLine><PieChart header="No of events" subHeader="by source" loading={loadingBySource}
                                      data={eventsBySource}/></MetricTimeLine>

        </div>
    </div>
}
