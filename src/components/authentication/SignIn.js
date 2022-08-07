import React, {useState, useEffect, useRef} from 'react';
import {Redirect, useLocation} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import {logout, setRoles, setToken} from "./login";
import {loginUser} from "../../remote_api/user";
import {signInTheme} from "../../themes";
import {showAlert} from "../../redux/reducers/alertSlice";
import {connect} from "react-redux";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {asyncRemote, getApiUrl, resetApiUrlConfig, setApiUrl as setStoredApiUrl} from "../../remote_api/entrypoint";
import Button from "../elements/forms/Button";
import PasswordInput from "../elements/forms/inputs/PasswordInput";
import ReadOnlyInput from "../elements/forms/ReadOnlyInput";
import {track} from "../../remote_api/track";

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

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "10px 20px",
        backgroundColor: 'white',
        borderRadius: "5px",
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

const SignInForm = ({showAlert}) => {
    const ver = version()
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const apiUrl = getApiUrl();

    useEffect(() => {
        setLoading(true);
        asyncRemote(
            {url: "/info/version"}
        ).then((response) => {
            setLoading(false);
            if (response?.status === 200) {
                if (response.data !== ver) {
                    setErrorMessage(
                        `The GUI verision ${ver} does not match the API verision.`
                    )
                }
            }
        }).catch((e) => {
            setLoading(false);
            setErrorMessage(
                'Could not connect to the API server. Please try again later.'
            )
        });
    }, [ver])

    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [progress, setProgress] = useState(false);

    const {state} = useLocation();
    const {from} = state || {from: {pathname: urlPrefix("/")}};
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const mounted = useRef(false);

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value);
    }
    const handlePassChange = (evt) => {
        setPassword(evt.target.value);
    }

    const handleEndpointReset = () => {
        resetApiUrlConfig();
        logout();
        window.location.reload()
    }

    const handleSubmit = async (event) => {

        track("9d9230c3-def2-451a-9b52-c554686f3e27", 'tracardi-login', {
            email, apiUrl
        }).then(() => {})

        const api = loginUser(email, password);
        setProgress(true);
        api.then(response => {
            setToken(response.data['access_token']);
            setRoles(response.data['roles']);
            setStoredApiUrl(apiUrl);
            setRedirectToReferrer(true);
        }).catch(e => {
                let message = e.message;
                if (typeof e.response == "undefined") {
                    message = 'Api unavailable.';
                } else if (e.response.status === 422) {
                    message = 'Bad request. Fill all fields.';
                } else if (typeof e.response.data['detail'] == "string") {
                    message = e.response.data['detail']
                }
                showAlert({type: "error", message: message, hideAfter: 3000})
            }).finally(()=>{
                if(mounted.current === true) {
                    setProgress(false)
                }
        });
        event.preventDefault();
    };


    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])


    if (redirectToReferrer) {
        return <Redirect to={from}/>;
    }

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={signInTheme}>
                <Container component="main" maxWidth="xs">
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>

                        {!loading && errorMessage ? (
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
                    </div>
                </Container>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default connect(
    null,
    {showAlert}
)(SignInForm)