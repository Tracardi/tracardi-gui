import React, {Suspense, useState, createContext} from "react";
import MainContent from "./MainContent";
import {Navigate, Routes, Route} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import urlPrefix from "../misc/UrlPrefix";
import PrivateTab from "./authentication/PrivateTab";
import {BsStar} from "react-icons/bs";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {ErrorBoundary} from "@sentry/react";
import TopBar from "./pages/top/TopBar";
import IdentificationPoint from "./pages/IdentificationPoint";
import {getDataContext, setDataContext} from "../config";
import {stagingTheme, productionTheme} from "../themes";
import {ThemeProvider} from "@mui/material/styles";
import EventTypesToRules from "./pages/EventRouting";

const ProRouter = React.lazy(() => import('./pages/pro/ProRouter'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const PageTabs = React.lazy(() => import('./pages/groups/PageTabs'))
const FlowEditor = React.lazy(() => import('./flow/FlowEditor'))
const EventReshaping = React.lazy(() => import("./pages/EventReshaping"))
const EventValidation = React.lazy(() => import("./pages/EventValidation"))
const LiveSegments = React.lazy(() => import("./pages/LiveSegments"))
const LogsAnalytics = React.lazy(() => import("./pages/LogsAnalytics"))
const UserAccount = React.lazy(() => import("./pages/UserAccount"))
const TryOut = React.lazy(() => import("./pages/TryOut"))
const EventsAnalytics = React.lazy(() => import("./pages/EventsAnalytics"))
const ProfilesAnalytics = React.lazy(() => import("./pages/ProfilesAnalytics"))
const SessionsAnalytics = React.lazy(() => import("./pages/SessionsAnalytics"))
const Reports = React.lazy(() => import("./pages/Reports"))
const BackgroundTasks = React.lazy(() => import("./pages/BackgroundTasks"))
const EntityAnalytics = React.lazy(() => import("./pages/EntityAnalytics"))
const EventSources = React.lazy(() => import("./pages/EventSources"))
const Consents = React.lazy(() => import("./pages/Consents"))
const ImportSources = React.lazy(() => import("./pages/ImportSources"))
const ElasticClusterHealthInfo = React.lazy(() => import("./pages/ElasticClusterHealthInfo"))
const ElasticIndicesInfo = React.lazy(() => import("./pages/ElasticIndicesInfo"))
const Migrations = React.lazy(() => import("./pages/Migrations"))
const EventManagement = React.lazy(() => import("./pages/EventManagement"))
const EventToProfile = React.lazy(() => import("./pages/EventToProfile"))
const EventRedirect = React.lazy(() => import('./pages/EventRedirect'))
const Users = React.lazy(() => import("./pages/Users"))
const Destinations = React.lazy(() => import("./pages/Destinations"))
const UserLogs = React.lazy(() => import("./pages/UserLogs"))
const Resources = React.lazy(() => import("./pages/Resources"))
const Flows = React.lazy(() => import("./pages/Flows"))
const Segments = React.lazy(() => import("./pages/Segments"))
const Rules = React.lazy(() => import("./pages/Rules"))
const FlowReader = React.lazy(() => import("./flow/FlowReader"))
const ActionPlugins = React.lazy(() => import("./pages/ActionPlugins"))
const PredefinedEventTypes = React.lazy(() => import("./pages/PredefinedEventTypes"))
const Deployment = React.lazy(() => import("./pages/Deployment"))
const Settings = React.lazy(() => import("./pages/Settings"))
const TestEditor = React.lazy(() => import("./pages/TestEditor"))
const Scheduler = React.lazy(() => import("./pages/Scheduler"))
const ConsentsDataCompliance = React.lazy(() => import("./pages/ConsentsCompliance"))

export const DataContext = createContext(null);

const AppBox = () => {

    const [production, setProduction] = useState(getDataContext(false))

    const handleContextChange = (context) => {
        setProduction(context);
        setDataContext(context)
    }

    return <DataContext.Provider value={production}>
        <ThemeProvider theme={production ? productionTheme : stagingTheme}>
        <MainContent onContextChange={handleContextChange}>

            {/*Redirects*/}

            <PrivateRoute exact path={urlPrefix("")} roles={["admin", "developer", "marketer", "maintainer"]}>
                <Navigate to={urlPrefix("/dashboard")}/>
            </PrivateRoute>


            {/*Dashboard*/}

            <Routes>
                <Route
                    exact
                    path={urlPrefix("/dashboard")}
                    roles={["admin", "developer", "marketer", "maintainer"]}
                    element={
                        <Suspense fallback={<CenteredCircularProgress/>}>
                            <TopBar>Dashboard</TopBar>
                            <Dashboard/>
                        </Suspense>
                    }
                />
            </Routes>

            {/*Pro*/}

            <PrivateRoute path={urlPrefix("/resources/*")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Resources</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <Resources
                                    defaultLayout={"rows"}/>, "/resources", "Resources"),
                            new PrivateTab(["admin", "developer"],
                                <ProRouter/>,
                                "/resources#pro",
                                <>
                                    <BsStar size={20}
                                            style={{marginRight: 5}}/>{"Extensions"}</>,
                                "#pro"),
                        ]}/>
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Inbound Traffic*/}

            <PrivateRoute path={urlPrefix("/inbound")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Inbound Traffic and Event Management</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <EventSources/>, "/inbound/sources", "Event Sources"),
                            new PrivateTab(["admin", "developer"],
                                <EventRedirect/>, "/inbound/event/redirect", <>
                                    <BsStar size={20} style={{marginRight: 5}}/>{"Event redirects"}
                                </>)
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Outbound Traffic*/}
            <PrivateRoute path={urlPrefix("/outbound")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Outbound Traffic</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <Destinations/>, "/outbound/destinations", "Destinations"),
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Import*/}

            <PrivateRoute path={urlPrefix("/import")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Import and Export</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <ImportSources/>, "/import/sources", "Import sources"),
                            new PrivateTab(["admin", "developer"], <BackgroundTasks
                                type="import"/>, "/import/tasks", "Running imports"),
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Routing*/}

            <PrivateRoute path={urlPrefix("/routing")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Traffic routing</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <EventTypesToRules/>, "/event/routing", "Event Routing Summary"),
                            new PrivateTab(["admin", "developer"],
                                <Rules/>, "/processing/routing", "Workflow Routing Rules"),
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Transformation*/}

            <PrivateRoute path={urlPrefix("/transformations")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Data Mapping and Transformation</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <EventValidation/>, "/inbound/event/validation", <>
                                    <BsStar size={20} style={{marginRight: 5}}/>{"Event validation"}
                                </>),
                            new PrivateTab(["admin", "developer"],
                                <EventReshaping/>, "/inbound/event/reshaping", <>
                                    <BsStar size={20} style={{marginRight: 5}}/>{"Event reshaping"}
                                </>),
                            new PrivateTab(["admin", "developer"],
                                <EventManagement/>, "/inbound/event/management", <><BsStar size={20}
                                                                                           style={{marginRight: 5}}/>{"Event mapping"}</>
                            ),
                            new PrivateTab(["admin", "developer"],
                                <EventToProfile/>, "/inbound/event-to-profile", "Event to profile mapping"
                            ),

                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Identification*/}

            <PrivateRoute path={urlPrefix("/identification")} roles={["admin", "developer", "marketer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Identity Resolution and Consents</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <IdentificationPoint/>, "/identification/point", <>
                                    <BsStar size={20} style={{marginRight: 5}}/>{"Identification points"}
                                </>),
                            new PrivateTab(["admin", "developer", "marketer"],
                                <Consents/>, "/consents/type", "Consent types"),
                            new PrivateTab(["admin", "developer", "marketer"],
                                <ConsentsDataCompliance/>, "/consents/compliance", <>
                                    <BsStar size={20}
                                            style={{marginRight: 5}}/>{"Event data compliance"}</>)
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Data*/}

            <PrivateRoute path={urlPrefix("/data")} roles={["admin", "marketer", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Data</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "marketer", "developer"],
                                <EventsAnalytics/>, "/data/events", "Events"),
                            new PrivateTab(["admin", "marketer", "developer"],
                                <ProfilesAnalytics/>, "/data/profiles", <>{window?.CONFIG?.profile?.plural || "Profiles"}</>),
                            new PrivateTab(["admin", "marketer", "developer"],
                                <SessionsAnalytics/>, "/data/sessions", "Sessions"),
                            !window?.CONFIG?.entity?.disable && new PrivateTab(["admin", "marketer", "developer"],
                                <EntityAnalytics/>, "/data/entities", <><BsStar size={20}
                                                                                style={{marginRight: 5}}/>{window?.CONFIG?.entity?.plural || "Entities"}</>)
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>

            </PrivateRoute>

            {/*Processing*/}

            <PrivateRoute path={urlPrefix("/processing")} roles={["admin", "developer", "marketer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Automation</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer"],
                                <Flows type="collection"
                                       label="Automation Workflows"/>, "/processing/workflows", "Automation Workflows")
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>


            <PrivateRoute path={urlPrefix("/segmentation")} roles={["admin", "developer", "marketer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Profile Segmentation</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer", "marketer"],
                                <LiveSegments/>, "/processing/live/segments", <>
                                    <BsStar size={20}
                                            style={{marginRight: 5}}/>{"Segmentation Jobs"}</>),
                            new PrivateTab(["admin", "developer"],
                                <Flows type="segmentation" label="Segmentation Workflows"/>, "/processing/workflows", <>
                                    <BsStar size={20}
                                            style={{marginRight: 5}}/>{"Segmentation workflows"}</>),
                            new PrivateTab(["admin", "developer", "marketer"],
                                <Segments/>, "/processing/segments", "Post event segmentation"),
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Reporting*/}

            <PrivateRoute path={urlPrefix("/reporting")} roles={["admin", "developer", "marketer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Reporting</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "developer", "marketer"],
                                <Reports/>, "/reporting/reports", "Reports")
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*The same only different path*/}
            <PrivateRoute exact path={urlPrefix("/flow/collection/edit/:id")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <FlowEditor/>
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>
            <PrivateRoute exact path={urlPrefix("/flow/collection/edit/:id/:eventId")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <FlowEditor/>
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>
            {/*The same only different path*/}
            <PrivateRoute exact path={urlPrefix("/flow/segmentation/edit/:id")} roles={["admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <FlowEditor/>
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            <PrivateRoute exact path={urlPrefix("/flow/preview/:id")} roles={["admin", "developer", "marketer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <FlowReader/>
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Monitoring*/}

            <PrivateRoute path={urlPrefix("/monitoring")} roles={["admin", "maintainer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Monitoring</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["admin", "maintainer"], <LogsAnalytics/>, "/monitoring/log", "Logs"),
                            new PrivateTab(["admin", "developer"],
                                <BackgroundTasks/>, "/monitoring/background/tasks", "Background tasks"),
                            // new PrivateTab(["admin", "developer"],
                            //     <Scheduler/>, "/scheduler/tasks", <><BsStar size={20}
                            //                                                    style={{marginRight: 5}}/>{"Scheduler tasks"}</>),
                            new PrivateTab(["admin", "maintainer"],
                                <UserLogs/>, "/monitoring/user-log", "User logs")
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Testing*/}

            <PrivateRoute exact path={urlPrefix("/test/form")} roles={["admin", "developer"]}>
                <TopBar>Testing</TopBar>
                <PageTabs tabs={[
                    new PrivateTab(["admin", "developer"],
                        <div style={{padding: "0 10px 0 10px"}}><TestEditor/></div>, "/test/form", "Event testing")
                ]}
                />
            </PrivateRoute>

            {/*Maintenance*/}

            <PrivateRoute path={urlPrefix("/maintenance")} roles={["maintainer", "admin", "developer"]}>
                <ErrorBoundary>
                    <Suspense fallback={<CenteredCircularProgress/>}>
                        <TopBar>Maintenance and Settings</TopBar>
                        <PageTabs tabs={[
                            new PrivateTab(["maintainer"],
                                <ElasticClusterHealthInfo/>, "/maintenance/elastic-cluster", "Cluster"),
                            window._env_?.MULTI_TENANT !== "true" && new PrivateTab(["maintainer"],
                                <ElasticIndicesInfo/>, "/maintenance/elastic-indices", "Indices"),
                            new PrivateTab(["maintainer"], <Migrations/>, "/maintenance/migration", "Migration"),
                            new PrivateTab(["admin"],
                                <Deployment/>, "/deployment", "Deployment"),
                            new PrivateTab(["admin"], <Users/>, "/maintenance/users", "Users"),
                            new PrivateTab(["admin", "developer"],
                                <ActionPlugins/>, "/settings/plugins", "Action plug-ins"),
                            new PrivateTab(["admin", "developer"],
                                <PredefinedEventTypes/>, "/event-type/predefined", "Build-in Event Types"),
                            new PrivateTab(["admin", "developer"],
                                <Settings/>, "/settings/system", "System settings"),
                        ]}
                        />
                    </Suspense>
                </ErrorBoundary>
            </PrivateRoute>

            {/*Current user account info*/}

            <PrivateRoute exact path={urlPrefix("/my-account")}
                          roles={["admin", "developer", "marketer", "maintainer"]}>
                <TopBar>My account</TopBar>
                <PageTabs tabs={[
                    new PrivateTab(["admin", "developer", "marketer", "maintainer"],
                        <UserAccount/>, "/my-account", "Account")
                ]}
                />
            </PrivateRoute>

            {/*Other*/}

            <Routes>
                <Route exact path={urlPrefix("/tryout")} element={<TryOut/>}/>
            </Routes>

        </MainContent>
        </ThemeProvider>
    </DataContext.Provider>
}

export default AppBox;