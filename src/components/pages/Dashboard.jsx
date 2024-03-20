import React, {useContext} from "react";
import EventTimeLine from "../elements/charts/EventsTimeLine";
import {LoadablePieChart} from "../elements/charts/PieChart";
import Grid from "@mui/material/Grid";
import {styled} from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import OnlineSessionCounter from "../elements/metrics/OnlineSessionsCounter";
import {AggregationTable} from "../elements/tables/EventByType";
import {
    getEventsBySource,
    getEventsByStatus,
    getEventsByTag, getEventsByType
} from "../../remote_api/endpoints/event";
import {useFetch} from "../../remote_api/remoteState";
import {
    getSessionsByApp,
    getSessionsByChannel,
    getSessionsByDeviceGeo,
    getSessionsByOsName, getSessionsByResolution
} from "../../remote_api/endpoints/session";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import useTheme from "@mui/material/styles/useTheme";
import {DataContext} from "../AppBox";

const Item = styled(Paper)(({theme, style}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    width: "calc(100% - 20px)",
    margin: 10,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    ...style
}));

// const InlineItem = styled(Paper)(({theme, style}) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     borderRadius: 10,
//     margin: 10,
//     width: "fit-content",
//     color: theme.palette.text.secondary,
//     ...style
// }));

const ContainedItem = styled(Paper)(({theme, style}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    width: "calc(100% - 20px)",
    margin: 10,
    color: "white",
    backgroundColor: theme.palette.primary.main,
    ...style
}));

// function SessionsByApp() {
//
// const theme = useTheme()
// const colorsList = theme.palette.charts.line
//
//     const {data, isLoading, error} = useFetch(
//         ["sessionsByApp"],
//         getSessionsByApp(20),
//         data => data
//     )
//
//     if(error) {
//         return "Error"
//     }
//
//     return <LoadablePieChart header="No of sessions" subHeader="by app" loading={isLoading}
//                              data={data}
//                              colors={colorsList}/>
//
// }


function EventsByType() {

    const theme = useTheme()
    const colorsList = theme.palette.charts.line
    const dataContext = useContext(DataContext)

    const {data, isLoading, error} = useFetch(
        ["eventByType", [dataContext]],
        getEventsByType(),
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

function Charts1() {

    const theme = useTheme()
    const colorsList = theme.palette.charts.line
    const dataContext = useContext(DataContext)

    const {data: byApp, isLoading: loadingByApp} = useFetch(
        ["sessionsByApp", [dataContext]],
        getSessionsByApp(20),
        data => data
    )

    const {data: byTag, isLoading: loadingByTag} = useFetch(
        ["eventsByTag", [dataContext]],
        getEventsByTag(),
        data => data
    )

    const {data: byStatus, isLoading: loadingByStatus} = useFetch(
        ["eventsByStatus", [dataContext]],
        getEventsByStatus(),
        data => data
    )

    const {data: bySource, isLoading: loadingBySource} = useFetch(
        ["eventsBySource", [dataContext]],
        getEventsBySource(),
        data => data
    )

    return <>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of sessions" subHeader="by application" loading={loadingByApp}
                                  data={byApp || []} colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of events" subHeader="by status" loading={loadingByStatus}
                                  data={byStatus || []} colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of events" subHeader="by tag" loading={loadingByTag}
                                  data={byTag || []}
                                  colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of events" subHeader="by source" loading={loadingBySource}
                                  data={bySource || []}
                                  colors={colorsList}/>
            </Item>
        </Grid>
    </>
}

function Charts2() {

    const theme = useTheme()
    const colorsList = theme.palette.charts.line
    const dataContext = useContext(DataContext)

    const {data: byGeoLocation, isLoading: loadingByGeoLocation} = useFetch(
        ["sessionsByGeoLocation", [dataContext]],
        getSessionsByDeviceGeo(),
        data => data
    )

    const {data: byOsName, isLoading: loadingByOsName} = useFetch(
        ["sessionsByOsName", [dataContext]],
        getSessionsByOsName(),
        data => data
    )

    const {data: byChannel, isLoading: loadingByChannel} = useFetch(
        ["sessionsByChannel", [dataContext]],
        getSessionsByChannel(),
        data => data
    )

    const {data: byResolution, isLoading: loadingByResolution} = useFetch(
        ["sessionsByResolution", [dataContext]],
        getSessionsByResolution(),
        data => data
    )

    return <>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of session" subHeader="by system name" loading={loadingByOsName}
                                  data={byOsName || []} colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of sessions" subHeader="by device location" loading={loadingByGeoLocation}
                                  data={byGeoLocation || []}
                                  colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of sessions" subHeader="by channel" loading={loadingByChannel}
                                  data={byChannel || []}
                                  colors={colorsList}/>
            </Item>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
            <Item elevation={0}>
                <LoadablePieChart header="No of sessions" subHeader="by screen resolution" loading={loadingByResolution}
                                  data={byResolution || []}
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
                    <Charts1/>
                </Grid>
                <Grid container item spacing={1}>
                    <Charts2/>
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
