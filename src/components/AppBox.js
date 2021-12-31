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
import '@szhsin/react-menu/dist/index.css';
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

const AppBox = () => {

    return <MainContent>

        {/*Redirects*/}

        <PrivateRoute exact path={urlPrefix("")} roles={["admin"]}>
            <Redirect to={urlPrefix("/data")}/>
        </PrivateRoute>


        {/*Pro*/}

        <PrivateRoute path={urlPrefix("/pro")} roles={["admin"]}>
            <TracardiPro/>
        </PrivateRoute>

        {/*Traffic*/}

        <PrivateRoute path={urlPrefix("/traffic")} roles={["admin"]}>
            <PageTabs title="Traffic"
                      tabs={{
                          "Inbound": <EventSources/>,
                          "Outbound": <Resources/>
                      }}
            />
        </PrivateRoute>

        {/*Data*/}

        <PrivateRoute path={urlPrefix("/data")} roles={["admin"]}>
            <PageTabs title="Data"
                      tabs={{
                          "Events": <EventsAnalytics/>,
                          "Profiles": <ProfilesAnalytics/>,
                          "Sessions": <SessionsAnalytics/>
                      }}
            />

        </PrivateRoute>

        {/*Processing*/}


        <PrivateRoute path={urlPrefix("/processing")} roles={["admin"]}>
            <PageTabs title="Processing"
                      tabs={{
                          "Workflows": <Flows/>,
                          "Rules": <Rules/>,
                          "Segments": <Segments/>
                      }}
            />
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/consents")} roles={["admin"]}>
            <PageTabs title="Consents"
                      tabs={{
                          "Consent types": <Consents/>
                      }}
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
                      tabs={{
                          "Running instances": <Instances/>,
                          "Scheduled tasks": <Tasks/>,
                      }}
            />

        </PrivateRoute>

        {/*Testing*/}

        <Route exact path={urlPrefix("/testing")}>
            <TestEditor/>
        </Route>

        {/*Settings*/}

        <PrivateRoute path={urlPrefix("/settings")} roles={["admin"]}>
            <PageTabs title="Settings"
                      tabs={{
                          "Workflow actions": <ActionPlugins/>,
                          "System settings": <Settings/>,
                      }}
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