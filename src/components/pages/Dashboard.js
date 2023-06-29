import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../remote_api/entrypoint";
import EventTimeLine from "../elements/charts/EventsTimeLine";
import {LoadablePieChart} from "../elements/charts/PieChart";
import Grid from "@mui/material/Grid";
import {styled} from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import OnlineSessionCounter from "../elements/metrics/OnlineSessionsCounter";
import {AggregationTable} from "../elements/tables/EventByType";
import {getEventByTypeAgg} from "../../remote_api/endpoints/event";
import {useFetch} from "../../remote_api/remoteState";
import {getSessionsByApp} from "../../remote_api/endpoints/session";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";

const Item = styled(Paper)(({theme, style}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    width: "calc(100% - 20px)",
    margin: 10,
    color: theme.palette.text.secondary,
    ...style
}));

const InlineItem = styled(Paper)(({theme, style}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    margin: 10,
    width: "fit-content",
    color: theme.palette.text.secondary,
    ...style
}));

const ContainedItem = styled(Paper)(({theme, style}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#3B82F6',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    width: "calc(100% - 20px)",
    margin: 10,
    color: "white",
    ...style
}));

function SessionsByApp() {

    const colorsList = [
        "#7795FF",'#3B82F6',
        '#3d5afe',
        "#8bc34a",
        "#4caf50",
        "#f44336",
        "#ff9800",
        "#FFB178",
        "#FF78B1",
        "#FF3C8E",
        "#A0BBFF", "#EC77FF",
        "#A0F9FF",
    ]

    const {data, isLoading, error} = useFetch(
        ["sessionsByApp"],
        getSessionsByApp(20),
        data => data.browsers
    )


    return <LoadablePieChart header="No of sessions" subHeader="by app" loading={isLoading}
                             data={data}
                             colors={colorsList}/>

}


function EventsByType() {

    const colorsList = [
        "#7795FF", '#3B82F6',
        '#3d5afe',
        "#8bc34a",
        "#4caf50",
        "#f44336",
        "#ff9800",
        "#FFB178",
        "#FF78B1",
        "#FF3C8E",
        "#A0BBFF", "#EC77FF",
        "#A0F9FF",
    ]

    const {data, isLoading, error} = useFetch(
        ["eventByType"],
        getEventByTypeAgg(20),
        data => data
    )

    if(isLoading) {
        return <CenteredCircularProgress/>
    }


    return <><LoadablePieChart header="No of events" subHeader="by type" loading={isLoading}
                               data={data}
                               colors={colorsList}/>
        <div style={{padding: "0 30px 30px 30px"}}>
            <AggregationTable data={data}/>
        </div>
    </>
}

function Charts() {

    const colorsList = [

        '#3d5afe', "#A0F9FF",
        "#8bc34a",
        "#4caf50",
        "#f44336",
        "#ff9800",
        "#FFB178",
        "#FF78B1",
        "#FF3C8E",
        "#A0BBFF", "#EC77FF", "#7795FF",'#3B82F6',

    ]

    const [eventsByTag, setEventsByTag] = useState([]);
    const [eventsBySource, setEventsBySource] = useState([]);
    const [eventsByStatus, setEventsByStatus] = useState([]);
    const [loadingByTag, setLoadingByTag] = useState(false);
    const [loadingBySource, setLoadingBySource] = useState(false);
    const [loadingByStatus, setLoadingByStatus] = useState(false);


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

    return <>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <SessionsByApp/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of event" subHeader="by status" loading={loadingByStatus}
                                  data={eventsByStatus} colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of events" subHeader="by tag" loading={loadingByTag}
                                  data={eventsByTag}
                                  colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of events" subHeader="by source" loading={loadingBySource}
                                  data={eventsBySource}
                                  colors={colorsList}/>
            </Item>
        </Grid>
    </>
}

export default function Dashboard() {

    return <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <Grid container spacing={1}>
            <Grid container item xs={7} md={8} lg={9}>
                <Grid item xs={3}>
                    <Item elevation={0}>
                        <EventsByType/>
                    </Item>
                </Grid>
                <Grid item xs={9}>
                    <Item style={{display: "flex"}} elevation={0}>
                        <div style={{width: "100%"}}>
                            <EventTimeLine/>
                        </div>
                    </Item>
                </Grid>
                <Grid container item spacing={1}>
                    <Charts/>
                </Grid>
                {/*<Grid container item spacing={1}>*/}
                {/*    <Grid item xs={3}>*/}
                {/*        <Item>*/}
                {/*            <SessionsByApp/>*/}
                {/*        </Item>*/}
                {/*    </Grid>*/}

                {/*</Grid>*/}
            </Grid>
            <Grid item xs={5} md={4} lg={3}>
                <ContainedItem elevation={0}>
                    <OnlineSessionCounter/>
                </ContainedItem>
            </Grid>

        </Grid>

    </div>
}
