import React from "react";
import "../lists/cards/SourceCard.css";
import "./RuleDetails.css";
import "./Details.css";
import Tabs, {TabCase} from "../tabs/Tabs";
import PropTypes from "prop-types";
import PiiDetails from "./PiiDetails";
import {ProfileData} from "./ProfileInfo";
import ProfileSessionsDetails from "./ProfileSessionsDetails";
import ProfileLogDetails from "./ProfileLogDetails";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import useTheme from "@mui/material/styles/useTheme";
import JsonBrowser from "../misc/JsonBrowser";
import {useFetch} from "../../../remote_api/remoteState";
import {
    getEventsByApp,
    getEventsByDevice, getEventsByDeviceBrand, getEventsByDeviceModel,
    getEventsByDeviceType,
    getEventsByType,
    getProfileById,
    getProfileEventsHistogram
} from "../../../remote_api/endpoints/profile";
import FetchError from "../../errors/FetchError";
import Properties from "./DetailProperties";
import {LoadablePieChart} from "../charts/PieChart";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import {BsBoxArrowDown} from "react-icons/bs";
import AreaChartDisplay from "../charts/AreaChart";
import {TuiForm, TuiFormGroup} from "../tui/TuiForm";

export default function ProfileDetails({profile}) {
    const _theme = useTheme()
    const displayPii = window?.CONFIG?.profile?.display?.details?.pii

    const {isLoading: isLoadingEventsByType, data: eventsByType} = useFetch(
        ['profileEventsByType'],
        getEventsByType(profile.id),
        data => data
    )

    const {isLoading: isLoadingEventsByDevice, data: eventsByDevice} = useFetch(
        ['profileEventsByDevice'],
        getEventsByDevice(profile.id),
        data => data
    )

    const {isLoading: isLoadingEventsByDeviceType, data: eventsByDeviceType} = useFetch(
        ['profileEventsByDeviceType'],
        getEventsByDeviceType(profile.id),
        data => data
    )

    const {isLoading: isLoadingEventsByDeviceBrand, data: eventsByDeviceBrand} = useFetch(
        ['profileEventsByDevicBrand'],
        getEventsByDeviceBrand(profile.id),
        data => data
    )

    const {isLoading: isLoadingEventsByDeviceModel, data: eventsByDeviceModel} = useFetch(
        ['profileEventsByDeviceModel'],
        getEventsByDeviceModel(profile.id),
        data => data
    )

    const {isLoading: isLoadingEventsByApp, data: eventsByApp} = useFetch(
        ['profileEventsByApp'],
        getEventsByApp(profile.id, false),
        data => data
    )

    const {data: eventsByAppTable} = useFetch(
        ['profileEventsByAppTable'],
        getEventsByApp(profile.id, true),
        data => data
    )

    return <div style={{height: "inherit", display: "flex", flexDirection: "column"}}>
        {displayPii && <PiiDetails profile={profile}/>}
        <div className="RightTabScroller">
            <Tabs tabs={["Personal", "Sessions", "Analytics", "E-Commerce", "Logs", "Json"]}
                  tabsStyle={{backgroundColor: _theme.palette.primary.light}}>
                <TabCase id={0}>
                    <ProfileData profile={profile}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfileSessionsDetails profileId={profile?.id}/>
                </TabCase>
                <TabCase id={2}>
                    <div style={{backgroundColor: "#f5f5f5", margin: 0, padding: 20}}>
                        <Accordion expanded={true} elevation={10}>
                            <AccordionSummary
                                expandIcon={<BsBoxArrowDown size={24}/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <h2 className="subHeader" style={{margin:0}}>Collected Events</h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}>
                                        <AreaChartDisplay endpoint={getProfileEventsHistogram(profile.id, "month")}
                                                          barChartColors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <LoadablePieChart
                                            paddingTop={0}
                                            loading={isLoadingEventsByType}
                                            data={eventsByType}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={3}>
                            <AccordionSummary
                                expandIcon={<BsBoxArrowDown size={24}/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <h2 className="subHeader" style={{margin:0}}>Used Devices <span style={{fontSize: "70%"}}>by Customer</span></h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <LoadablePieChart
                                            header="Devices"
                                            subHeader="by name"
                                            loading={isLoadingEventsByDevice}
                                            data={eventsByDevice}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <LoadablePieChart
                                            header="Devices"
                                            subHeader="by type"
                                            loading={isLoadingEventsByDeviceType}
                                            data={eventsByDeviceType}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <LoadablePieChart
                                            header="Devices"
                                            subHeader="by model"
                                            loading={isLoadingEventsByDeviceModel}
                                            data={eventsByDeviceModel}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <LoadablePieChart
                                            header="Devices"
                                            subHeader="by brand"
                                            loading={isLoadingEventsByDeviceBrand}
                                            data={eventsByDeviceBrand}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion elevation={3}>
                            <AccordionSummary
                                expandIcon={<BsBoxArrowDown size={24}/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <h2 className="subHeader" style={{margin:0}}>Used Applications <span style={{fontSize: "70%"}}>by Customer</span></h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <LoadablePieChart
                                            header="Used Applications"
                                            subHeader="by name"
                                            loading={isLoadingEventsByApp}
                                            data={eventsByApp}
                                            colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}/>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Properties properties={eventsByAppTable}/>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                    </div>


                </TabCase>
                <TabCase id={3}>
                    <div className="Box10">
                        <NoData header="This feature will be implemented soon">
                           This is a placeholder for the feature that will be implemented in minor version of 0.8.1.x.
                        </NoData>
                    </div>
                </TabCase>
                <TabCase id={4}>
                    <div className="Box10">
                        {profile?.id
                            ? <ProfileLogDetails profileId={profile.id}/>
                            : <NoData header="This event has no profile attached.">
                                That means the profile was deleted.
                            </NoData>}
                    </div>
                </TabCase>
                <TabCase id={5}>
                    <TuiForm style={{margin: 20}}>
                        <TuiFormGroup style={{overflow: "auto"}}>
                            <JsonBrowser data={profile}/>
                        </TuiFormGroup>
                    </TuiForm>
                </TabCase>
            </Tabs>
        </div>
    </div>;
}

export function ProfileDetailsById({id}) {

    const query = useFetch(
        ["getProfile", [id]],
        getProfileById(id),
        data => {
            return data
        })

    if (query.isError) {
        if (query.error.status === 404)
            return <NoData header="Could not find profile.">
                This can happen if the profile was deleted or archived.
            </NoData>
        return <FetchError error={query.error}/>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <ProfileDetails profile={query.data}/>}
    </>
}

ProfileDetails.propTypes = {
    profile: PropTypes.object,
};