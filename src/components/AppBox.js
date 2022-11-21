import React, {Suspense} from "react";
import MainContent from "./MainContent";
import {Redirect, Route} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import urlPrefix from "../misc/UrlPrefix";
import PrivateTab from "./authentication/PrivateTab";
import {BsStar} from "react-icons/bs";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {ErrorBoundary} from "@sentry/react";
import TopBar from "./pages/top/TopBar";

const ProRouter = React.lazy(() => import('./pages/pro/ProRouter'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const PageTabs = React.lazy(() => import('./pages/groups/PageTabs'))
const FlowEditor = React.lazy(() => import('./flow/FlowEditor'))
const EventReshaping =  React.lazy(() => import("./pages/EventReshaping"))
const EventValidation =  React.lazy(() => import("./pages/EventValidation"))
const LiveSegments =  React.lazy(() => import("./pages/LiveSegments"))
const LogsAnalytics =  React.lazy(() => import("./pages/LogsAnalytics"))
const UserAccount =  React.lazy(() => import("./pages/UserAccount"))
const TryOut =  React.lazy(() => import("./pages/TryOut"))
const EventsAnalytics =  React.lazy(() => import("./pages/EventsAnalytics"))
const ProfilesAnalytics =  React.lazy(() => import("./pages/ProfilesAnalytics"))
const SessionsAnalytics =  React.lazy(() => import("./pages/SessionsAnalytics"))
const Reports =  React.lazy(() => import("./pages/Reports"))
const BackgroundTasks =  React.lazy(() => import("./pages/BackgroundTasks"))
const EntityAnalytics =  React.lazy(() => import("./pages/EntityAnalytics"))
const EventSources =  React.lazy(() => import("./pages/EventSources"))
const Consents =  React.lazy(() => import("./pages/Consents"))
const ImportSources =  React.lazy(() => import("./pages/ImportSources"))
const ElasticClusterHealthInfo =  React.lazy(() => import("./pages/ElasticClusterHealthInfo"))
const ElasticIndicesInfo =  React.lazy(() => import("./pages/ElasticIndicesInfo"))
const Migrations =  React.lazy(() => import("./pages/Migrations"))
const EventManagement =  React.lazy(() => import("./pages/EventManagement"))
const Users =  React.lazy(() => import("./pages/Users"))
const Destinations =  React.lazy(() => import("./pages/Destinations"))
const UserLogs =  React.lazy(() => import("./pages/UserLogs"))
const Resources =  React.lazy(() => import("./pages/Resources"))
const Flows =  React.lazy(() => import("./pages/Flows"))
const Segments =  React.lazy(() => import("./pages/Segments"))
const Rules =  React.lazy(() => import("./pages/Rules"))
const FlowReader =  React.lazy(() => import("./flow/FlowReader"))
const ActionPlugins =  React.lazy(() => import("./pages/ActionPlugins"))
const Instances =  React.lazy(() => import("./pages/Instances"))
const Settings =  React.lazy(() => import("./pages/Settings"))
const TestEditor =  React.lazy(() => import("./pages/TestEditor"))

const AppBox = () => {

    return <MainContent>

        {/*Redirects*/}

        <PrivateRoute exact path={urlPrefix("")} roles={["admin", "developer", "marketer", "maintainer"]}>
            <Redirect to={urlPrefix("/dashboard")}/>
        </PrivateRoute>


        {/*Dashboard*/}

        <Route exact path={urlPrefix("/dashboard")} roles={["admin", "developer", "marketer", "maintainer"]}>
            <Suspense fallback={<CenteredCircularProgress/>}>
                <TopBar>Dashboard</TopBar>
                <Dashboard/>
            </Suspense>
        </Route>

        {/*Pro*/}

        <PrivateRoute path={urlPrefix("/resources")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Resources</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Resources
                                          defaultLayout={"rows"}/>, "/resources", "Resources"),
                                  new PrivateTab(["admin", "developer"],
                                      <ProRouter/>, "/resources/pro", <>
                                          <BsStar size={20}
                                                  style={{marginRight: 5}}/>{"Extensions"}</>),
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
                                      <EventManagement/>, "/inbound/event/management", "Event metadata"),
                                  new PrivateTab(["admin", "developer"],
                                      <EventValidation/>, "/inbound/event/validation", <>
                                      <BsStar size={20} style={{marginRight: 5}}/>{"Event validation"}
                                      </>),
                                  new PrivateTab(["admin", "developer"],
                                      <EventReshaping/>, "/inbound/event/reshaping", <>
                                          <BsStar size={20} style={{marginRight: 5}}/>{"Event reshaping"}
                                      </>),
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

        {/*Data*/}

        <PrivateRoute path={urlPrefix("/data")} roles={["admin", "marketer", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Data</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "marketer", "developer"],
                                      <EventsAnalytics/>, "/data/events", "Events"),
                                  new PrivateTab(["admin", "marketer", "developer"],
                                      <ProfilesAnalytics/>, "/data/profiles", "Profiles"),
                                  new PrivateTab(["admin", "marketer", "developer"],
                                      <SessionsAnalytics/>, "/data/sessions", "Sessions"),
                                  new PrivateTab(["admin", "marketer", "developer"],
                                      <EntityAnalytics/>, "/data/entities", "Entities")
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>

        </PrivateRoute>

        {/*Processing*/}

        <PrivateRoute path={urlPrefix("/processing")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Data Collection and Integration</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Flows type="collection" label="Integration Workflows"/>, "/processing/workflows", "Integration Workflows"),
                                  new PrivateTab(["admin", "developer"],
                                      <Rules/>, "/processing/routing", "Routing Rules"),
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        {/*Segmentation*/}

        <PrivateRoute path={urlPrefix("/segmentation")} roles={["admin", "developer", "marketer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Segmentation</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Flows type="segmentation" label="Segmentation Workflows"/>, "/processing/workflows", <>
                                          <BsStar size={20}
                                                  style={{marginRight: 5}}/>{"Segmentation workflows"}</>),
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <LiveSegments/>, "/processing/live/segments", <>
                                          <BsStar size={20}
                                                  style={{marginRight: 5}}/>{"Live segmentation"}</>),
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

        <PrivateRoute path={urlPrefix("/consents")} roles={["admin", "developer", "marketer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Consents</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <Consents/>, "/consents/type", "Consent types")
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
                                  new PrivateTab(["admin", "maintainer"],
                                      <Instances/>, "/monitoring/instances", "Running instances"),
                                  new PrivateTab(["admin", "developer"],
                                      <BackgroundTasks/>, "/monitoring/background/tasks", "Background tasks"),
                                  new PrivateTab(["admin", "maintainer"],
                                      <UserLogs/>, "/monitoring/user-log", "User logs")
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        {/*Testing*/}

        <PrivateRoute exact path={urlPrefix("/testing")} roles={["admin", "developer"]}>
            <TopBar>Testing</TopBar>
            <PageTabs tabs={[
                new PrivateTab(["admin", "developer"],
                    <div style={{padding: "0 10px 0 10px"}}><TestEditor/></div>, "/testing", "Event testing"),
            ]}
            />
        </PrivateRoute>

        {/*Settings*/}

        <PrivateRoute path={urlPrefix("/settings")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Settings</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Settings/>, "/settings/system", "System settings"),
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>

        </PrivateRoute>

        {/*Maintenance*/}

        <PrivateRoute path={urlPrefix("/maintenance")} roles={["maintainer", "admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <TopBar>Maintenance</TopBar>
                    <PageTabs tabs={[
                                  new PrivateTab(["maintainer"],
                                      <ElasticClusterHealthInfo/>, "/maintenance/elastic-cluster", "Cluster"),
                                  new PrivateTab(["maintainer"],
                                      <ElasticIndicesInfo/>, "/maintenance/elastic-indices", "Indices"),
                                  new PrivateTab(["maintainer"], <Migrations/>, "/maintenance/migration", "Migration"),
                                  new PrivateTab(["admin"], <Users/>, "/maintenance/users", "Users"),
                                  new PrivateTab(["admin", "developer"],
                                      <ActionPlugins/>, "/settings/plugins", "Action plug-ins"),
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        {/*Current user account info*/}

        <PrivateRoute exact path={urlPrefix("/my-account")} roles={["admin", "developer", "marketer", "maintainer"]}>
            <TopBar>My account</TopBar>
            <PageTabs tabs={[
                new PrivateTab(["admin", "developer", "marketer", "maintainer"],
                    <UserAccount/>, "/my-account", "Account")
            ]}
            />
        </PrivateRoute>

        {/*Other*/}

        <Route exact path={urlPrefix("/tryout")}>
            <TryOut/>
        </Route>

    </MainContent>
}

export default AppBox;