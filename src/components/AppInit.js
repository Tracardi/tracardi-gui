import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import PrivateRoute from "./authentication/PrivateRoute";
import App from "./App";
import SignIn from "./authentication/SignIn";
import Logout from "./authentication/Logout";
import history from '../history';
import urlPrefix from "../misc/UrlPrefix";

export default function AppInit() {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path={urlPrefix("/login")}>
                    <SignIn/>
                </Route>
                <Route exact path={urlPrefix("/logout")}>
                    <Logout/>
                </Route>
                <PrivateRoute path={urlPrefix("")}>
                    <App/>
                </PrivateRoute>
            </Switch>
        </Router>
    );
}
