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

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const App = ({alert}) => {

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
            </Router>
        );
    }

    return application();
}

const mapState = (state) => {
    return {
        alert: state.alertReducer,
    }
}
export default connect(mapState)(App);
