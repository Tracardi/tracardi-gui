import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AppBox from "./AppBox";
import {connect, useDispatch} from "react-redux";
import {hideAlert} from "../redux/reducers/alertSlice";
import Logout from "./authentication/Logout";
import SignIn from "./authentication/SignIn";
import PrivateRoute from "./authentication/PrivateRoute";
import "./App.css";
import urlPrefix from "../misc/UrlPrefix";
import AlertTitle from "@material-ui/lab/AlertTitle";
import FormDrawer from "./elements/drawers/FormDrawer";
import {close} from "../redux/reducers/newResource";
import ResourceForm from "./elements/forms/ResourceForm";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
                    <PrivateRoute path={urlPrefix("")} roles={["admin", "user"]}>
                        <AppBox/>
                    </PrivateRoute>
                </Switch>
                <Snackbar open={alert.show} autoHideDuration={alert.hideAfter} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alert.type}>
                        <AlertTitle style={{textTransform: "uppercase"}}>{alert.type}</AlertTitle>
                        <span style={{fontWeight: 400}}>{alert.message}</span>
                    </Alert>
                </Snackbar>
                <FormDrawer open={resource.show} onClose={() => {close()}} width={550}>
                    <ResourceForm onClose={() => {close()}}/>
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
