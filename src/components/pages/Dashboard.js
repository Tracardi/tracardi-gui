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
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";

export default function Dashboard() {

    const [eventsByType, setEventsByType] = useState([]);
    const [eventsByTag, setEventsByTag] = useState([]);
    const [eventsBySource, setEventsBySource] = useState([]);
    const [eventsByStatus, setEventsByStatus] = useState([]);
    const [loadingByType, setLoadingByType] = useState(false);
    const [loadingByTag, setLoadingByTag] = useState(false);
    const [loadingBySource, setLoadingBySource] = useState(false);
    const [loadingByStatus, setLoadingByStatus] = useState(false);

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    useEffect(() => {
        setLoadingByType(true);
        asyncRemote({
            url: "events/by_type"
        }).then((response) => {
            if (response) {
                setEventsByType(response.data)
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
        }).then((response) => {
            if (response) {
                setEventsByTag(response.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByTag(false)
        })
    }, [])

    useEffect(() => {
        setLoadingByStatus(true);
        asyncRemote({
            url: "events/by_status"
        }).then((response) => {
            if (response) {
                setEventsByStatus(response.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByStatus(false)
        })
    }, [])

    useEffect(() => {
        setLoadingBySource(true);
        asyncRemote({
            url: "events/by_source"
        }).then((response) => {
            if (response) {
                setEventsBySource(response.data);
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingBySource(false)
        })
    }, [])

    const PieChart = ({loading, data, header, subHeader = null, fill = "#1976d2", colors}) => {
        return <div style={{paddingTop: 20}}>
            {header && <header style={{display: "flex", justifyContent: "center"}}>{header}</header>}
            {subHeader &&
            <header style={{display: "flex", justifyContent: "center", fontSize: "70%"}}>{subHeader}</header>}
            <div style={{width: 280, height: 200}}>
                {!loading && <TuiPieChart data={data} fill={fill} colors={colors}/>}
                {loading && <CenteredCircularProgress/>}
            </div>
        </div>

    }

    return <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <MetricTimeLine fitContent={false}>
            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                <div style={{width: "100%", height: 325, padding: 30}}>
                    <EventTimeLine/>
                </div>
            </div>
        </MetricTimeLine>
        <div style={{display: "flex", flexWrap: "wrap"}}>
            <MetricTimeLine>
                <InstancesCounter/>
            </MetricTimeLine>
            <MetricTimeLine>
                <AvgEventTime/>
            </MetricTimeLine>
            <MetricTimeLine onClick={go('/data')}>
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
        <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap"}}>

            <MetricTimeLine><PieChart header="No of events" subHeader="by type" loading={loadingByType}
                                      data={eventsByType}
                                      colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/></MetricTimeLine>
            <MetricTimeLine><PieChart header="No of event" subHeader="by status" loading={loadingByStatus}
                                      data={eventsByStatus} colors={['#0088FE', '#00C49F', 'red']}/></MetricTimeLine>
            <MetricTimeLine><PieChart header="No of events" subHeader="by tag" loading={loadingByTag}
                                      data={eventsByTag}
                                      colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/></MetricTimeLine>
            <MetricTimeLine><PieChart header="No of events" subHeader="by source" loading={loadingBySource}
                                      data={eventsBySource}
                                      colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/></MetricTimeLine>

        </div>
    </div>
}
