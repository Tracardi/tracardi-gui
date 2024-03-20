import React, {Suspense, useContext} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {connect, useDispatch} from "react-redux";
import {hideAlert} from "../redux/reducers/alertSlice";
import PrivateRoute from "./authentication/PrivateRoute";
import "./App.css";
import AlertTitle from '@mui/material/AlertTitle';
import FormDrawer from "./elements/drawers/FormDrawer";
import {close} from "../redux/reducers/newResource";
import ResourceForm from "./elements/forms/ResourceForm";
import CenteredCircularProgress from "./elements/progress/CenteredCircularProgress";
import {IdleTimerProvider} from "react-idle-timer";
import {QueryClient, QueryClientProvider} from "react-query";
// import {ReactQueryDevtools} from 'react-query/devtools'
import Installer from "./Installer";
import KeyCloakAuthProvider, {KeyCloakContext} from "./context/KeyCloakContext";


const AppBox = React.lazy(() => import('./AppBox'))

const App = ({alert, resource, close}) => {

    const dispatch = useDispatch()
    const queryClient = new QueryClient()
    const authContext = useContext(KeyCloakContext)

    const onIdle = () => {
        if(authContext.logout) {
            authContext.logout()
        }
    }

    const handleClose = () => {
        dispatch(hideAlert())
    };

    return (
        <IdleTimerProvider
            onIdle={onIdle}
            stopOnIdle={true}
            startManually={true}
            timeout={20 * 60 * 1000}
            throttle={500}
            events={["connect"]}
        >
            <QueryClientProvider client={queryClient}>
                <Installer>
                    <Router>
                        <KeyCloakAuthProvider enabled={false}>
                        <Routes>
                            <Route
                                path="*"
                                element={
                                    <PrivateRoute path="*" roles={["admin", "marketer", "developer", "maintainer"]}>
                                        <Suspense fallback={<CenteredCircularProgress/>}>
                                            <AppBox/>
                                        </Suspense>
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                        <Snackbar open={alert.show} autoHideDuration={alert.hideAfter} onClose={handleClose}
                                  anchorOrigin={{
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
                        </KeyCloakAuthProvider>
                    </Router>

                    {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
                </Installer>
            </QueryClientProvider>

        </IdleTimerProvider>
    );
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
