import React, {useContext, useState} from 'react';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';
import {makeStyles} from "tss-react/mui";
import {signInTheme} from "../../themes";
import version from '../../misc/version';
import {getApiUrl, resetApiUrlConfig, setApiUrl as setStoredApiUrl} from "../../remote_api/entrypoint";
import Button from "../elements/forms/Button";
import PasswordInput from "../elements/forms/inputs/PasswordInput";
import ReadOnlyInput from "../elements/forms/ReadOnlyInput";
import {track} from "../../remote_api/track";
import getLocation from "../../misc/location";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {BsShieldLock} from "react-icons/bs";
import {useIdleTimerContext} from "react-idle-timer";
import {useFetch} from "../../remote_api/remoteState";
import {getSystemInfo} from "../../remote_api/endpoints/system";
import {userLogIn} from "../../remote_api/endpoints/user";
import {useRequest} from "../../remote_api/requestClient";
import {KeyCloakContext} from "../context/KeyCloakContext";
import ErrorBox from "../errors/ErrorBox";
import envs from "../../envs";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="http://www.tracardi.com/">
                TRACARDI
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles()((theme) => ({
    paper: {
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        color: "black"
    },
    avatar: {
        margin: 1
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: 1,
    },
    input: {
        color: "black",
    },
    submit: {
        margin: "3px 0 2px"
    }
}));

const SignInForm = () => {
    const guiVersion = version()
    const apiUrl = getApiUrl();

    const {classes} = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [progress, setProgress] = useState(false);
    const [authError, setAuthError] = useState(null);

    const idleTimer = useIdleTimerContext()
    const {request} = useRequest()
    const authContext = useContext(KeyCloakContext)

    const {isLoading, data: installedVersion, error} = useFetch(
        ["systemInfo"],
        getSystemInfo(),
        (data) => {return data}
    )

    let errorMessage;
    if (installedVersion !== guiVersion) {
        errorMessage = `The GUI verision ${guiVersion} does not match the API version.`
    }
    if(error) {
        errorMessage = 'Could not connect to the API server. Please try again later.'
    }

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value);
    }
    const handlePassChange = (evt) => {
        setPassword(evt.target.value);
    }

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        authContext.logout()
        window.location.replace("/");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        getLocation().then(result => {
            if(envs.license === 'open-source'){
                track("9d9230c3-def2-451a-9b52-c554686f3e27", 'tracardi-login', {
                    email,
                    apiUrl,
                    platform: "Tracardi " + version(),
                    location: result
                }, false).then(() => {})
            }

        })

        setProgress(true)
        setAuthError(null)
        try {

            const data = await request(userLogIn(email, password), true)

            setStoredApiUrl(apiUrl);
            idleTimer.start()

            authContext.setState({
                isAuthenticated: true,
                token: data['access_token'],
                roles: data['roles']
            })

        } catch (error) {

            if (error.status === 404) {
                setAuthError( 'Api unavailable.')
            } else if (error.status === 422) {
                setAuthError( 'Bad request. Fill all fields.')
            } else if (error?.response?.data?.detail) {
                setAuthError(error.response.data.detail)
            }

        } finally {
            setProgress(false)
        }
    };

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={signInTheme}>
                <Grid container display="flex" justifyContent="center" alignItems="center"
                      style={{height: "100%"}}>
                    <Grid item xs={10} sm={8} md={7} lg={6} xl={4}>
                        <Paper className={classes.paper}>

                            <BsShieldLock size={40}/>
                            <div>
                                <span style={{
                                    fontSize: "150%",
                                    textTransform: "uppercase",
                                    fontWeight: 400,
                                    fontFamily: "Viga, IBM Plex Sans, serif"
                                }}>TRACARDI</span>
                                <div style={{fontSize: 11, color: "gray", textAlign: "center"}}> v. {version()}</div>
                            </div>


                            {!isLoading && errorMessage ? (
                                <p style={{
                                    backgroundColor: "#c2185b",
                                    padding: "3px 6px",
                                    borderRadius: 4,
                                    color: "white",
                                    marginTop: "10px",
                                    fontSize: "90%"

                                }}>{errorMessage}</p>
                            ) : null}

                            <ReadOnlyInput label="Tracardi API"
                                           value={apiUrl}
                                           hint="You will authorize yourself in the above Tracardi server."
                                           onReset={handleEndpointReset}/>

                            <form onSubmitCapture={handleSubmit} className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    size="small"
                                    autoFocus
                                    onChange={handleEmailChange}/>
                                <PasswordInput
                                    fullWidth={true}
                                    label="Password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handlePassChange}
                                    required={true}
                                    value={password || ""}
                                />

                                <Button
                                    style={{justifyContent: "center", marginTop: 20}}
                                    label="Sign In"
                                    onClick={handleSubmit}
                                    progress={progress}
                                />
                            </form>
                            <Box mt={1}>
                                <Copyright/>
                            </Box>

                        </Paper>
                        {authError && <ErrorBox style={{borderRadius: 10}}>{authError}</ErrorBox>}
                    </Grid>

                </Grid>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default SignInForm;