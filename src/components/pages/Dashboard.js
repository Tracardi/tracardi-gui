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

import './DashboardDrag.css';
import RGL, {WidthProvider} from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

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
        setLoadingByStatus(true);
        asyncRemote({
            url: "events/by_status"
        }).then((resposne) => {
            if (resposne) {
                setEventsByStatus(resposne.data)
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
        }).then((resposne) => {
            if (resposne) {
                setEventsBySource(resposne.data);
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingBySource(false)
        })
    }, [])

    const PieChart = ({loading, data, header, subHeader = null, fill = "#1976d2", colors}) => {
        return <div style={{paddingTop: 20, width: "100%"}}>
            {header && <header style={{display: "flex", justifyContent: "center"}}>{header}</header>}
            {subHeader &&
            <header style={{display: "flex", justifyContent: "center", fontSize: "70%"}}>{subHeader}</header>}
            <div style={{width: "100%", height: 200}}>
                {!loading && <TuiPieChart data={data} fill={fill} colors={colors}/>}
                {loading && <CenteredCircularProgress/>}
            </div>
        </div>

    }

    return <ReactGridLayout
        className="layout"
        width={1900}
        cols={8}
        rowHeight={30}
        autoSize={true}
        isResizable={false}
        onLayoutChange={(v) => console.log(v)}
    >
        <div key="1" data-grid={{i: "1", x: 0, y: 0, w: 8, h: 9}}>
            <MetricTimeLine fitContent={false}>
                <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                    <div style={{width: "100%", height: 330, padding: 30}}>
                        <EventTimeLine/>
                    </div>
                </div>
            </MetricTimeLine>
        </div>
        <div key="2" data-grid={{i: "2", x: 0, y: 8, w: 1, h: 3}}>
            <MetricTimeLine>
                <InstancesCounter/>
            </MetricTimeLine>
        </div>
        <div key="3" data-grid={{i: "3", x: 1, y: 8, w: 1, h: 3}}>
            <MetricTimeLine>
                <AvgEventTime/>
            </MetricTimeLine>
        </div>
        <div key="4" data-grid={{i: "4", x: 2, y: 8, w: 2, h: 3}}>
            <MetricTimeLine onClick={go('/data')}>
                <EventCounter/>
                <EventLineChart/>
            </MetricTimeLine>
        </div>
        <div key="5" data-grid={{i: "5", x: 4, y: 8, w: 2, h: 3}}>
            <MetricTimeLine>
                <ProfileCounter/>
                <ProfileLineChart/>
            </MetricTimeLine>
        </div>
        <div key="6" data-grid={{i: "6", x:6, y: 8, w: 2, h: 3}}>
            <MetricTimeLine>
                <SessionCounter/>
                <SessionLineChart/>
            </MetricTimeLine>
        </div>
        <div key="7" data-grid={{i: "7", x: 0, y: 13, w: 2, h: 7}}>
            <MetricTimeLine>
                <PieChart header="No of events" subHeader="by type" loading={loadingByType}
                          data={eventsByType}
                          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
            </MetricTimeLine>
        </div>
        <div key="8" data-grid={{i: "8", x: 2, y: 13, w: 2, h: 7}}>
            <MetricTimeLine>
                <PieChart header="No of event" subHeader="by status" loading={loadingByStatus}
                          data={eventsByStatus} colors={['#0088FE', '#00C49F', 'red']}/>
            </MetricTimeLine>
        </div>
        <div key="9" data-grid={{i: "9", x: 4, y: 13, w: 2, h: 7}}>
            <MetricTimeLine>
                <PieChart header="No of events" subHeader="by tag" loading={loadingByTag}
                          data={eventsByTag}
                          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
            </MetricTimeLine>
        </div>
        <div key="10" data-grid={{i: "10", x: 6, y: 13, w: 2, h: 7}}>
            <MetricTimeLine>
                <PieChart header="No of events" subHeader="by source" loading={loadingBySource}
                          data={eventsBySource}
                          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
            </MetricTimeLine>
        </div>
    </ReactGridLayout>
}
