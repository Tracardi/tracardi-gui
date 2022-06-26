import React from "react";
import MainContent from "./MainContent";
import {Redirect, Route} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import Resources from "./pages/Resources";
import Rules from "./pages/Rules";
import EventsAnalytics from "./pages/EventsAnalytics";
import ProfilesAnalytics from "./pages/ProfilesAnalytics";
import SessionsAnalytics from "./pages/SessionsAnalytics";
import FlowEditor from "./flow/FlowEditor";
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
import PageTabs from "./pages/groups/PageTabs";
import Consents from "./pages/Consents";
import Dashboard from "./pages/Dashboard";
import EventManagement from "./pages/EventManagement";
import Users from "./pages/Users";
import Destinations from "./pages/Destinations";
import EventTags from "./pages/EventTags";
import UserLogs from "./pages/UserLogs";
import PrivateTab from "./authentication/PrivateTab";
import UserAccount from "./pages/UserAccount";
import LogsAnalytics from "./pages/LogsAnalytics";
import ImportSources from "./pages/ImportSources";
import ImportTasks from "./pages/ImportTasks";
import ProRouter from "./pages/pro/ProRouter";
import ElasticClusterHealthInfo from "./pages/ElasticClusterHealthInfo";
import ElasticIndicesInfo from "./pages/ElasticIndicesInfo";
import {BsStar} from "react-icons/bs";

const AppBox = () => {

    return <MainContent>

        {/*Redirects*/}

        <PrivateRoute exact path={urlPrefix("")} roles={["admin", "developer", "marketer"]}>
            <Redirect to={urlPrefix("/dashboard")}/>
        </PrivateRoute>


        {/*Dashboard*/}

        <Route exact path={urlPrefix("/dashboard")}>
            <Dashboard/>
        </Route>

        {/*Pro*/}

        <PrivateRoute path={urlPrefix("/resources")} roles={["admin", "developer"]}>
            <PageTabs title="Resources"
                      tabs={[
                          new PrivateTab(["admin", "developer"], <Resources
                              defaultLayout={"rows"}/>, "/resources", "Resources"),
                          new PrivateTab(["admin", "developer"],
                              <ProRouter/>, "/resources/pro", <><BsStar size={20} style={{marginRight: 5}}/>{"Premium Services"}</>),
                      ]}/>
        </PrivateRoute>

        {/*Traffic*/}

        <PrivateRoute path={urlPrefix("/traffic")} roles={["admin", "developer"]}>
            <PageTabs title="Traffic"
                      tabs={[
                          new PrivateTab(["admin", "developer"], <EventSources/>, "/traffic/sources", "Sources"),
                          new PrivateTab(["admin", "developer"], <Destinations/>, "/traffic/destinations", "Destinations"),
                      ]}
            />
        </PrivateRoute>

        {/*Import*/}

        <PrivateRoute path={urlPrefix("/import")} roles={["admin", "developer"]}>
            <PageTabs title="Import and Export"
                      tabs={[
                          new PrivateTab(["admin", "developer"], <ImportSources/>, "/import/sources", "Import sources"),
                          new PrivateTab(["admin", "developer"], <ImportTasks/>, "/import/tasks", "Running imports"),
                      ]}
            />
        </PrivateRoute>

        {/* Validation */}
        <PrivateRoute path={urlPrefix("/management")} roles={["admin", "developer"]}>
            <PageTabs title="Management"
                      tabs={[
                          new PrivateTab(["admin", "developer"],
                              <EventManagement/>, "/management/event", "Event types"),
                      ]}
            />
        </PrivateRoute>

        {/*Data*/}

        <PrivateRoute path={urlPrefix("/data")} roles={["admin", "marketer", "developer"]}>
            <PageTabs title="Data"
                      tabs={[
                          new PrivateTab(["admin", "marketer", "developer"], <EventsAnalytics/>, "/data/events", "Events"),
                          new PrivateTab(["admin", "marketer", "developer"], <ProfilesAnalytics/>, "/data/profiles", "Profiles"),
                          new PrivateTab(["admin", "marketer", "developer"], <SessionsAnalytics/>, "/data/sessions", "Sessions"),
                      ]}
            />

        </PrivateRoute>

        {/*Processing*/}

        <PrivateRoute path={urlPrefix("/processing")} roles={["admin", "developer", "marketer"]}>
            <PageTabs title="Processing"
                      tabs={[
                          new PrivateTab(["admin", "developer"], <Flows/>, "/processing/workflows", "Workflows"),
                          new PrivateTab(["admin", "developer"], <Rules/>, "/processing/routing", "Routing Rules"),
                          new PrivateTab(["admin", "developer", "marketer"], <Segments/>, "/processing/segments", "Segments"),
                      ]}
            />
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/consents")} roles={["admin", "developer", "marketer"]}>
            <PageTabs title="Consents"
                      tabs={[
                          new PrivateTab(["admin", "developer", "marketer"], <Consents/>, "/consents/type", "Consent types")
                      ]}
            />
        </PrivateRoute>

        <PrivateRoute exact path={urlPrefix("/flow/edit/:id")} roles={["admin", "developer"]}>
            <FlowEditor/>
        </PrivateRoute>
        <PrivateRoute exact path={urlPrefix("/flow/preview/:id")} roles={["admin", "developer", "marketer"]}>
            <FlowReader/>
        </PrivateRoute>

        {/*Monitoring*/}

        <PrivateRoute path={urlPrefix("/monitoring")} roles={["admin"]}>
            <PageTabs title="Monitoring"

                      tabs={[
                          new PrivateTab(["admin"], <LogsAnalytics/>, "/monitoring/log", "Logs"),
                          new PrivateTab(["admin"], <Instances/>, "/monitoring/instances", "Running instances"),
                          new PrivateTab(["admin"], <UserLogs/>, "/monitoring/user-log", "User logs"),
                          new PrivateTab(["admin"], <ElasticClusterHealthInfo/>, "/monitoring/elastic-cluster", "Elasticsearch cluster"),
                          new PrivateTab(["admin"], <ElasticIndicesInfo/>, "/monitoring/elastic-indices", "Elasticsearch indices")
                      ]}
            />

        </PrivateRoute>

        {/*Testing*/}

        <PrivateRoute exact path={urlPrefix("/testing")} roles={["admin", "developer"]}>
            <TestEditor/>
        </PrivateRoute>

        {/*Settings*/}

        <PrivateRoute path={urlPrefix("/settings")} roles={["admin", "developer", "marketer"]}>
            <PageTabs title="Settings"
                      tabs={[
                              new PrivateTab(["admin", "developer"], <ActionPlugins/>, "/settings/plugins", "Workflow actions"),
                              new PrivateTab(["admin", "developer"], <Settings/>, "/settings/system", "System settings"),
                              new PrivateTab(["admin"], <Users/>, "/settings/users", "Users"),
                              new PrivateTab(["admin", "developer", "marketer"], <EventTags/>, "/settings/event-tags", "Event tags"),
                          ]}
            />

        </PrivateRoute>

        {/*Current user account info*/}

        <PrivateRoute exact path={urlPrefix("/my-account")} roles={["admin", "developer", "marketer"]}>
            <UserAccount />
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