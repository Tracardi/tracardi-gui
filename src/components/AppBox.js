import React from "react";
import "./AppBox.css";
import MainMenu from "./menu/MainMenu";
import MainContent from "./MainContent";
import SubContent from "./SubContent";
import SubMenu from "./menu/SubMenu";
import SubMenuItem from "./menu/SubMenuItem";
import MainMenuItem from "./menu/MainMenuItem";
import {Route, Redirect} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import Sources from "./pages/Sources";
import Rules from "./pages/Rules";
import ManualPage from "./pages/manual/ManualPage";
import {RouteCase, RouteSwitch} from "./elements/misc/RouteCase";
import EventsAnalytics from "./pages/EventsAnalytics";
import ProfilesAnalytics from "./pages/ProfilesAnalytics";
import SessionsAnalytics from "./pages/SessionsAnalytics";
import {GoDatabase} from "@react-icons/all-files/go/GoDatabase";
import {VscDebugConsole} from "@react-icons/all-files/vsc/VscDebugConsole";
import {FaTools} from "@react-icons/all-files/fa/FaTools";
import {ImExit} from "@react-icons/all-files/im/ImExit";
import FlowEditor from "./flow/FlowEditor";
import Flows from "./pages/Flows";
import urlPrefix from "../misc/UrlPrefix";
import ActionPlugins from "./pages/ActionPlugins";
import Credentials from "./pages/Credentials";

const AppBox = () => {

    return <MainContent>

        <MainMenu>
            <MainMenuItem icon={<GoDatabase size={20}/>} title={"Data"} link={urlPrefix("/home")} defaultLink={urlPrefix("/home")}/>
            <MainMenuItem icon={<FaTools size={20}/>} title={"Set-up"} link={urlPrefix("/setup")}/>
            <MainMenuItem icon={<VscDebugConsole size={20}/>} title={"Manual"} link={urlPrefix("/manual")}/>
            <MainMenuItem icon={<ImExit size={20}/>} title={"Logout"} link={urlPrefix("/logout")}/>
        </MainMenu>

        <PrivateRoute exact path={urlPrefix("")} roles={["admin"]}>
            <Redirect to={urlPrefix("/home/events")}/>
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/home")} roles={["admin"]}>
            <SubMenu title="Data">
                <SubMenuItem link={urlPrefix("/home/events")} defaultLink={[urlPrefix("/home"), urlPrefix("")]}>Events</SubMenuItem>
                <SubMenuItem link={urlPrefix("/home/profiles")}>Profiles</SubMenuItem>
                <SubMenuItem link={urlPrefix("/home/sessions")}>Sessions</SubMenuItem>
            </SubMenu>
            <Redirect to={urlPrefix("/home/events")}/>
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/setup")} roles={["admin"]}>
            <SubMenu title="Set-up">

                <SubMenuItem link={urlPrefix("/setup/sources")}>Sources</SubMenuItem>
                <SubMenuItem link={urlPrefix("/setup/rules")}>Rules</SubMenuItem>
                <SubMenuItem link={urlPrefix("/setup/flows")} defaultLink={[urlPrefix("/setup")]}>Flows</SubMenuItem>
                <SubMenuItem link={urlPrefix("/setup/flow-actions")}>Flow actions</SubMenuItem>
                <SubMenuItem link={urlPrefix("/setup/credentials")}>Credentials</SubMenuItem>
                <SubMenuItem link={urlPrefix("/setup/segments")}>Segments</SubMenuItem>
            </SubMenu>
        </PrivateRoute>

        <PrivateRoute path={urlPrefix("/manual")} roles={["admin"]}>
            <SubMenu title="Dev">
                <SubMenuItem link={urlPrefix("/manual/uql")}>UQL Manual</SubMenuItem>
                <RouteSwitch>
                    <RouteCase link={urlPrefix("/manual/uql")}>
                        <SubMenuItem link={urlPrefix("/manual/uql/select")}>&gt; Select UQL</SubMenuItem>
                        <SubMenuItem link={urlPrefix("/manual/uql/create")}>&gt; Create UQL</SubMenuItem>
                        <SubMenuItem link={urlPrefix("/manual/uql/delete")}>&gt; Delete UQL</SubMenuItem>
                    </RouteCase>
                </RouteSwitch>
            </SubMenu>
        </PrivateRoute>

        <SubContent>
            <div className="contentPane">
                <div className="content">

                    <PrivateRoute path={urlPrefix("/home/events")} roles={["admin"]}>
                        <EventsAnalytics/>
                    </PrivateRoute>

                    <PrivateRoute path={urlPrefix("/home/profiles")} roles={["admin"]}>
                        <ProfilesAnalytics/>
                    </PrivateRoute>

                    <PrivateRoute path={urlPrefix("/home/sessions")} roles={["admin"]}>
                        <SessionsAnalytics/>
                    </PrivateRoute>

                    <PrivateRoute exact path={urlPrefix("/home")} roles={["admin"]}>

                    </PrivateRoute>

                    <PrivateRoute exact path={urlPrefix("")} roles={["admin"]}>

                    </PrivateRoute>

                    <PrivateRoute path={urlPrefix("/setup/sources")} roles={["admin"]}>
                        <Sources/>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/flows")} roles={["admin"]}>
                        <Flows/>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/flow/:id")} roles={["admin"]}>
                        <FlowEditor/>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/flow-actions")} roles={["admin"]}>
                        <ActionPlugins/>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/rules")} roles={["admin"]}>
                        <Rules/>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/segments")} roles={["admin"]}>
                    </PrivateRoute>
                    <PrivateRoute path={urlPrefix("/setup/credentials")} roles={["admin"]}>
                        <Credentials/>
                    </PrivateRoute>
                    <PrivateRoute exact path={urlPrefix("/setup")} roles={["admin"]}>
                        <Flows/>
                    </PrivateRoute>

                    <Route exact path={urlPrefix("/manual/uql/select")}>
                        <ManualPage mdFile="uql/select"/>
                    </Route>
                    <Route exact path={urlPrefix("/manual/uql/create")}>
                        <ManualPage mdFile="uql/create"/>
                    </Route>
                    <Route exact path={urlPrefix("/manual/uql/delete")}>
                        <ManualPage mdFile="uql/delete"/>
                    </Route>
                    <Route exact path={urlPrefix("/manual/uql")}>
                        <ManualPage mdFile="start"/>
                    </Route>
                </div>
            </div>
        </SubContent>
    </MainContent>
}

export default AppBox;