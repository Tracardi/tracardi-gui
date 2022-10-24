import React, {Suspense} from "react";
import MainContent from "./MainContent";
import {Redirect, Route} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import Resources from "./pages/Resources";
import Rules from "./pages/Rules";
import EventsAnalytics from "./pages/EventsAnalytics";
import ProfilesAnalytics from "./pages/ProfilesAnalytics";
import SessionsAnalytics from "./pages/SessionsAnalytics";
import Flows from "./pages/Flows";
import urlPrefix from "../misc/UrlPrefix";
import ActionPlugins from "./pages/ActionPlugins";
import Segments from "./pages/Segments";
import FlowReader from "./flow/FlowReader";
import Instances from "./pages/Instances";
import Settings from "./pages/Settings";
import TryOut from "./pages/TryOut";
import TestEditor from "./pages/TestEditor";
import NewUser from "./pages/NewUser";
import EventSources from "./pages/EventSources";
import Consents from "./pages/Consents";
import EventManagement from "./pages/EventManagement";
import Users from "./pages/Users";
import Destinations from "./pages/Destinations";
import EventTags from "./pages/EventTags";
import UserLogs from "./pages/UserLogs";
import PrivateTab from "./authentication/PrivateTab";
import UserAccount from "./pages/UserAccount";
import LogsAnalytics from "./pages/LogsAnalytics";
import ImportSources from "./pages/ImportSources";
import ElasticClusterHealthInfo from "./pages/ElasticClusterHealthInfo";
import ElasticIndicesInfo from "./pages/ElasticIndicesInfo";
import Migrations from "./pages/Migrations";
import {BsStar} from "react-icons/bs";
import BackgroundTasks from "./pages/BackgroundTasks";
import EntityAnalytics from "./pages/EntityAnalytics";
import Reports from "./pages/Reports";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {ErrorBoundary} from "@sentry/react";
import LiveSegments from "./pages/LiveSegments";

const ProRouter = React.lazy(() => import('./pages/pro/ProRouter'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const PageTabs = React.lazy(() => import('./pages/groups/PageTabs'))
const FlowEditor = React.lazy(() => import('./flow/FlowEditor'))

const AppBox = () => {

    return <MainContent>

        {/*Redirects*/}

        <PrivateRoute exact path={urlPrefix("")} roles={["admin", "developer", "marketer", "maintainer"]}>
            <Redirect to={urlPrefix("/dashboard")}/>
        </PrivateRoute>


        {/*Dashboard*/}

        <Route exact path={urlPrefix("/dashboard")} roles={["admin", "developer", "marketer", "maintainer"]}>
            <Suspense fallback={<CenteredCircularProgress/>}><Dashboard/></Suspense>
        </Route>

        {/*Pro*/}

        <PrivateRoute path={urlPrefix("/resources")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Resources"
                              tabs={[
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

        <PrivateRoute path={urlPrefix("/inbound")} roles={["admin", "developer", "marketer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Inbound Traffic and Event Management"
                              tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <EventSources/>, "/inbound/sources", "Sources"),
                                  new PrivateTab(["admin", "developer"],
                                      <EventManagement/>, "/inbound/event/management", "Event validation and reshaping"),
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <EventTags/>, "/inbound/event/tags", "Event tagging"),
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        {/*Outbound Traffic*/}
        <PrivateRoute path={urlPrefix("/outbound")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Outbound Traffic"
                              tabs={[
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
                    <PageTabs title="Import and Export"
                              tabs={[
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
                    <PageTabs title="Data"
                              tabs={[
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

        <PrivateRoute path={urlPrefix("/processing")} roles={["admin", "developer", "marketer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Collection and Processing"
                              tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Flows type="collection"/>, "/processing/workflows", "Workflows"),
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
                    <PageTabs title="Segmentation"
                              tabs={[
                                  new PrivateTab(["admin", "developer"],
                                      <Flows type="segmentation"/>, "/processing/workflows", "Workflows"),
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <Segments/>, "/processing/segments", "Segmentation"),
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <LiveSegments/>, "/processing/live/segments", <>
                                          <BsStar size={20}
                                                  style={{marginRight: 5}}/>{"Live segmentation"}</>),
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        {/*Reporting*/}

        <PrivateRoute path={urlPrefix("/reporting")} roles={["admin", "developer", "marketer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Reporting"
                              tabs={[
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
                    <PageTabs title="Consents"
                              tabs={[
                                  new PrivateTab(["admin", "developer", "marketer"],
                                      <Consents/>, "/consents/type", "Consent types")
                              ]}
                    />
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>

        <PrivateRoute exact path={urlPrefix("/flow/edit/:id")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <FlowEditor/>
                </Suspense>
            </ErrorBoundary>
        </PrivateRoute>
        <PrivateRoute exact path={urlPrefix("/flow/preview/:id")} roles={["admin", "developer", "marketer"]}>
            <FlowReader/>
        </PrivateRoute>

        {/*Monitoring*/}

        <PrivateRoute path={urlPrefix("/monitoring")} roles={["admin", "maintainer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Monitoring"

                              tabs={[
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
            <TestEditor/>
        </PrivateRoute>

        {/*Settings*/}

        <PrivateRoute path={urlPrefix("/settings")} roles={["admin", "developer"]}>
            <ErrorBoundary>
                <Suspense fallback={<CenteredCircularProgress/>}>
                    <PageTabs title="Settings"
                              tabs={[
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
                    <PageTabs title="Maintenance"
                              tabs={[
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
            <UserAccount/>
        </PrivateRoute>

        {/*Other*/}

        <Route exact path={urlPrefix("/tryout")}>
            <TryOut/>
        </Route>
        <Route exact path={urlPrefix("/user/new")}>
            <NewUser/>
        </Route>

    </MainContent>
}

export default AppBox;