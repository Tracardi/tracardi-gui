import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../remote_api/entrypoint";
import ProfileCounter from "../elements/metrics/ProfileCounter";
import SessionCounter from "../elements/metrics/SessionCounter";
import EventCounter from "../elements/metrics/EventCounter";
import InstancesCounter from "../elements/metrics/InstancesCounter";
import AvgEventTime from "../elements/metrics/AvgEventTimeCounter";
import EventTimeLine from "../elements/charts/EventsTimeLine";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {LoadablePieChart} from "../elements/charts/PieChart";
import Grid from "@mui/material/Grid";
import {styled} from '@mui/material/styles';
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({theme, style}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    width: "100%",
    color: theme.palette.text.secondary,
    ...style
}));

export default function Dashboard() {

    const [eventsByType, setEventsByType] = useState([]);
    const [eventsByTag, setEventsByTag] = useState([]);
    const [eventsBySource, setEventsBySource] = useState([]);
    const [eventsByStatus, setEventsByStatus] = useState([]);
    const [loadingByType, setLoadingByType] = useState(false);
    const [loadingByTag, setLoadingByTag] = useState(false);
    const [loadingBySource, setLoadingBySource] = useState(false);
    const [loadingByStatus, setLoadingByStatus] = useState(false);

    const navigate = useNavigate();
    const go = (url) => {
        return () => navigate(urlPrefix(url));
    }

    useEffect(() => {
        setLoadingByType(true);
        asyncRemote({
            url: "/events/by_type"
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
            url: "/events/by_tag"
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
            url: "/events/by_status"
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
            url: "/events/by_source"
        }).then((response) => {
            if (response) {
                setEventsBySource(response.data);
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingBySource(false)
        })
    }, [])

    return <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <Grid container spacing={2} style={{padding: 5}}>
            <Grid item xs={12}>
                <Item style={{display: "flex"}}>
                    <div style={{width: "100%", height: 325, padding: 30}}>
                        <EventTimeLine/>
                    </div>
                </Item>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
                <Item style={{display: "flex"}}>
                    <EventCounter/>
                    <ProfileCounter/>
                    <SessionCounter/>
                </Item>
            </Grid>
            <Grid item xs={12} md={12} lg={6}>
                <Item style={{display: "flex"}}>
                    <InstancesCounter/>
                    <AvgEventTime/>
                </Item>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <Item><LoadablePieChart header="No of events" subHeader="by type" loading={loadingByType}
                                        data={eventsByType}
                                        colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/></Item>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <Item>
                    <LoadablePieChart header="No of event" subHeader="by status" loading={loadingByStatus}
                                      data={eventsByStatus} colors={['#0088FE', '#00C49F', 'red']}/>
                </Item>

            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <Item>
                    <LoadablePieChart header="No of events" subHeader="by tag" loading={loadingByTag}
                                      data={eventsByTag}
                                      colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                </Item>

            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <Item>
                    <LoadablePieChart header="No of events" subHeader="by source" loading={loadingBySource}
                                      data={eventsBySource}
                                      colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                </Item>

            </Grid>
        </Grid>

    </div>
}
