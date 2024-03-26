import React, {useContext, useState} from "react";

import Grid from "@mui/material/Grid";
import {styled} from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import OnlineSessionCounter from "../elements/metrics/OnlineSessionsCounter";
import {useFetch} from "../../remote_api/remoteState";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import useTheme from "@mui/material/styles/useTheme";
import {DataContext} from "../AppBox";
import NoData from "../elements/misc/NoData";
import Tag from "../elements/misc/Tag";
import "./Dashboard.css";
import {getEventsByType, getTopEvents} from "../../remote_api/endpoints/event";
import {DateTimeDifference} from "../elements/misc/DateValue";
import IconLabel from "../elements/misc/IconLabels/IconLabel";
import {displayLocation} from "../../misc/location";
import EventTypeTag from "../elements/misc/EventTypeTag";
import {getTopProfiles} from "../../remote_api/endpoints/profile";
import {ProfileCard} from "../elements/details/ProfileInfo";
import {LoadablePieChart} from "../elements/charts/PieChart";
import {AggregationTable} from "../elements/tables/EventByType";
import FormDrawer from "../elements/drawers/FormDrawer";
import {EventDetailsById} from "../elements/details/EventDetails";
import {ProfileDetailsById} from "../elements/details/ProfileDetails";
import RevealContent from "../elements/misc/RevealContent";

const Item = styled(Paper)(({theme, style}) => ({
    ...theme.typography.body2,
    borderRadius: 10,
    width: "100%",
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    ...style
}));



const ContainedItem = styled(Paper)(({theme, style}) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 10,
    color: "white",
    backgroundColor: theme.palette.primary.main,
    ...style
}));


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
    console.log(data)
    if(data) {
        return <><LoadablePieChart header="No of events" subHeader="by type" loading={isLoading}
                                   data={data}
                                   colors={colorsList}/>
            <div style={{padding: "0 30px 30px 30px"}}>
                <AggregationTable data={data}/>
            </div>
        </>
    }
    return <NoData header="No Statistics"/>
}

function Events() {

    const [eventId, setEventId] = useState(null)
    const dataContext = useContext(DataContext)

    const {data, isLoading, error} = useFetch(
        ["evenList", [dataContext]],
        getTopEvents(20),
        data => data
    )

    const renderRows = (data) => {
        if(data?.result) {
            return data.result.map((row, index) => {
                return <div className="EventCard" onClick={()=>setEventId(row.id)} key={index} style={{
                    fontSize: "120%",
                    padding: "15px 10px",
                    borderBottom: "dashed 1px rgba(128,128,128,.5)",
                    display: "flex",
                    gap: 7,
                    flexDirection: "column"
                }}>
                    <span className="flexLine">
                        <EventTypeTag event={row} short={true}/>
                        {row?.metadata?.channel && <Tag>{row.metadata.channel}</Tag>}
                        <DateTimeDifference date={row?.metadata?.time?.insert}/>
                    </span>
                    <span>
                        {row?.device?.geo?.country?.name
                            ? <IconLabel
                                value={<span title={row?.device?.ip} style={{cursor: "help"}}>{displayLocation(row?.device?.geo)}</span>}

                            />
                            : row?.session?.tz && <IconLabel
                            value={row?.session?.tz}

                        />}
                    </span>

                </div>
            })
        }
    }

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    if(data?.total === 0) {
        return <NoData header="No Events"/>
    }
    return <RevealContent>
        {renderRows(data)}
        <FormDrawer open={eventId!==null} onClose={()=>setEventId(null)}><EventDetailsById id={eventId}/></FormDrawer>
    </RevealContent>


    return ""
}

function Profiles() {

    const [profileId, setProfileId] = useState(null)
    const dataContext = useContext(DataContext)

    const {data, isLoading, error} = useFetch(
        ["profileList", [dataContext]],
        getTopProfiles(5),
        data => data
    )

    const renderRows = (data) => {
        if(data?.result) {
            return data.result.map((row, index) => {
                return <div onClick={()=>setProfileId(row.id)} style={{cursor: "pointer"}}><ProfileCard profile={row}/></div>
            })
        }
    }

    if(isLoading) {
        return <CenteredCircularProgress/>
    }

    if(data?.total === 0) {
        return <NoData header="No Profiles"></NoData>
    }
    return <RevealContent>
        {renderRows(data)}
        <FormDrawer open={profileId!==null} onClose={()=>setProfileId(null)}><ProfileDetailsById id={profileId}/></FormDrawer>
    </RevealContent>


    return ""
}

export default function Dashboard() {

    return <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
        <Grid container spacing={2}>
            <Grid container item xs={12} md={6} lg={3}>
                <Item elevation={0} style={{padding: 20}}>
                    <EventsByType />
                </Item>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>

                <Item elevation={0}>
                    <ContainedItem elevation={0}>
                        <OnlineSessionCounter/>
                    </ContainedItem>
                    <Profiles />
                </Item>
            </Grid>
            <Grid container item xs={12} md={6} lg={4}>
                <Item elevation={0} style={{padding: 20}}>
                    <h1 className="BoxH1" style={{marginBottom: 20}}>Live Event Stream</h1>
                    <Events />
                </Item>
            </Grid>

        </Grid>

    </div>
}
