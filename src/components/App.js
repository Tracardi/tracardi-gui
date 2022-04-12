import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AppBox from "./AppBox";
import {connect, useDispatch} from "react-redux";
import {hideAlert} from "../redux/reducers/alertSlice";
import Logout from "./authentication/Logout";
import SignIn from "./authentication/SignIn";
import PrivateRoute from "./authentication/PrivateRoute";
import "./App.css";
import urlPrefix from "../misc/UrlPrefix";
import AlertTitle from '@mui/material/AlertTitle';
import FormDrawer from "./elements/drawers/FormDrawer";
import {close} from "../redux/reducers/newResource";
import ResourceForm from "./elements/forms/ResourceForm";

const App = ({alert, resource, close}) => {

    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(hideAlert())
    };

    const application = () => {
        return (
            <Router>
                <Switch>
                    <Route exact path={urlPrefix("/login")}>
                        <SignIn/>
                    </Route>
                    <Route exact path={urlPrefix("/logout")}>
                        <Logout/>
                    </Route>
                    <PrivateRoute path={urlPrefix("/")} roles={["admin", "marketer", "developer"]}>
                        <AppBox/>
                    </PrivateRoute>
                </Switch>
                <Snackbar open={alert.show} autoHideDuration={alert.hideAfter} onClose={handleClose} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}>
                    <MuiAlert variant="filled" elevation={6} onClose={handleClose} severity={alert.type}>
                        <AlertTitle style={{textTransform: "uppercase"}}>{alert.type}</AlertTitle>
                        <span style={{fontWeight: 400}}>{alert.message}</span>
                    </MuiAlert>
                </Snackbar>
                <FormDrawer open={resource.show} onClose={() => {
                    close()
                }} width={550}>
                    <ResourceForm onClose={() => {
                        close()
                    }}/>
                </FormDrawer>
            </Router>
        );
    }

    return application();
}

const mapState = (state) => {
    return {
        alert: state.alertReducer,
        resource: state.newResource
    }
}
export default connect(
    mapState,
    {close}
)(App);
