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
import Tasks from "./pages/Tasks";
import TryOut from "./pages/TryOut";
import TestEditor from "./pages/TestEditor";
import NewUser from "./pages/NewUser";
import EventSources from "./pages/EventSources";
import TracardiPro from "./pages/TracardiPro";
import PageTabs from "./pages/groups/PageTabs";
import Consents from "./pages/Consents";
import Dashboard from "./pages/Dashboard";
import EventValidation from "./pages/EventValidation";
import Logs from "./pages/Logs";
import Users from "./pages/Users";
import Destinations from "./pages/Destinations";
import EventTags from "./pages/EventTags";
import PrivateTab from "./authentication/PrivateTab";

const AppBox = () => {

    return <MainContent>

        {/*Redirects*/}

        <PrivateRoute exact path={urlPrefix("")} roles={["admin"]}>
            <Redirect to={urlPrefix("/data")}/>
        </PrivateRoute>


        {/*Dashboard*/}

        <Route exact path={urlPrefix("/dashboard")}>
            <PageTabs title="Dashboard"
                      tabs={[
                          new PrivateTab(["admin"], <Dashboard/>, "/dashboard/events", "Events")
                      ]}
            />

        </Route>

        {/*Pro*/}

        <PrivateRoute path={urlPrefix("/pro")} roles={["admin"]}>
            <TracardiPro/>
        </PrivateRoute>

        {/*Traffic*/}

        <PrivateRoute path={urlPrefix("/traffic")} roles={["admin"]}>
            <PageTabs title="Traffic"
                      tabs={[
                          new PrivateTab(["admin"], <EventSources/>, "/traffic/sources", "Sources"),
                          new PrivateTab(["admin"], <Resources/>, "/traffic/resources", "Resources"),
                          new PrivateTab(["admin"], <Destinations/>, "/traffic/destinations", "Destinations"),
                      ]}
            />
        </PrivateRoute>

        {/* Validation */}
        <PrivateRoute path={urlPrefix("/validation")} roles={["admin"]}>
            <PageTabs title="Data validation"
                      tabs={[
                          new PrivateTab(["admin"],
                              <EventValidation/>, "/validation/schema", "Event validation schemas"),
                      ]}
            />
        </PrivateRoute>

        {/*Data*/}

        <PrivateRoute path={urlPrefix("/data")} roles={["admin"]}>
            <PageTabs title="Data"
                      tabs={[
                          new PrivateTab(["admin"], <EventsAnalytics/>, "/data/events", "Events"),
                          new PrivateTab(["admin"], <ProfilesAnalytics/>, "/data/profiles", "Profiles"),
                          new PrivateTab(["admin"], <SessionsAnalytics/>, "/data/sessions", "Sessions"),
                      ]}
            />

        </PrivateRoute>

        {/*Processing*/}


        <PrivateRoute path={urlPrefix("/processing")} roles={["admin"]}>
            <PageTabs title="Processing"
                      tabs={[
                          new PrivateTab(["admin"], <Flows/>, "/processing/workflows", "Workflows"),
                          new PrivateTab(["admin"], <Rules/>, "/processing/routing", "Routing Rules"),
                          new PrivateTab(["admin"], <Segments/>, "/processing/segments", "Segments"),
                      ]}
            />
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/consents")} roles={["admin"]}>
            <PageTabs title="Consents"
                      tabs={[
                          new PrivateTab(["admin"], <Consents/>, "/consents/type", "Consent types")
                      ]}
            />
        </PrivateRoute>

        <PrivateRoute exact path={urlPrefix("/setup/flow/edit/:id")} roles={["admin"]}>
            <FlowEditor/>
        </PrivateRoute>
        <PrivateRoute exact path={urlPrefix("/setup/flow/:id")} roles={["admin"]}>
            <FlowReader/>
        </PrivateRoute>

        {/*Monitoring*/}

        <PrivateRoute path={urlPrefix("/monitoring")} roles={["admin"]}>
            <PageTabs title="Monitoring"
                      tabs={[
                          new PrivateTab(["admin"], <Instances/>, "/monitoring/instances", "Running instances"),
                          new PrivateTab(["admin"], <Tasks/>, "/monitoring/schedule", "Scheduled tasks"),
                          new PrivateTab(["admin"], <Logs/>, "/monitoring/log", "Logs")
                      ]}
            />

        </PrivateRoute>

        {/*Testing*/}

        <Route exact path={urlPrefix("/testing")}>
            <TestEditor/>
        </Route>

        {/*Settings*/}

        <PrivateRoute path={urlPrefix("/settings")} roles={["admin"]}>
            <PageTabs title="Settings"
                      tabs={[
                              new PrivateTab(["admin"], <ActionPlugins/>, "/settings/plugins", "Workflow actions"),
                              new PrivateTab(["admin"], <Settings/>, "/settings/system", "System settings"),
                              new PrivateTab(["admin"], <Users/>, "/settings/users", "Users"),
                              new PrivateTab(["admin"], <EventTags/>, "/settings/event-tags", "Event tags"),
                          ]}
            />

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