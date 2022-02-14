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
import {setRoles, setToken} from "./login";
import {loginUser} from "../../remote_api/user";
import {signInTheme} from "../../themes";
import {showAlert} from "../../redux/reducers/alertSlice";
import {connect} from "react-redux";
import urlPrefix from "../../misc/UrlPrefix";
import Autocomplete from '@mui/material/Autocomplete';
import version from '../../misc/version';
import storageValue from "../../misc/localStorageDriver";
import {asyncRemote} from "../../remote_api/entrypoint";
import Button from "../elements/forms/Button";
import PasswordInput from "../elements/forms/inputs/PasswordInput";

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
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: "10px 20px",
        backgroundColor: 'white',
        borderRadius: "5px",
        color: "black"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    input: {
        color: "black",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
}));

const SignInForm = ({showAlert}) => {
    const ver = version()
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const nodeRef = useRef(null);

    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [endpoint, setEndpoint] = useState(new storageValue('tracardi-api-url').read([]));
    const [progress, setProgress] = useState(false);

    const {state} = useLocation();
    const {from} = state || {from: {pathname: urlPrefix("/")}};
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])


    const handleEmailChange = (evt) => {
        setEmail(evt.target.value);
    }
    const handlePassChange = (evt) => {
        setPassword(evt.target.value);
    }

    const handleEndpoint = (value) => {
        setEndpoint(value);
        new storageValue('tracardi-api-url').save(value, "");
    }

    const handleSubmitEndpoint = () => {
        let historicalEndpoints = new storageValue('tracardi-api-urls').read([]);
        if (historicalEndpoints === null) {
            historicalEndpoints = [];
        }
        if (!historicalEndpoints.includes(endpoint)) {
            if (endpoint !== null) {
                historicalEndpoints.push(endpoint);
                new storageValue('tracardi-api-urls').save(historicalEndpoints, []);
            }
        }
    };

    const handleSubmit = event => {
        const api = loginUser(email, password);
        setProgress(true);
        api.then(response => {
            setToken(response.data['access_token']);
            setRoles(response.data['roles'])
            setRedirectToReferrer(true);
            handleSubmitEndpoint();
        }).catch(e => {
                let message = e.message;
                if (typeof e.response == "undefined") {
                    message = 'Api unavailable.';
                } else if (e.response.status === 422) {
                    message = 'Bag request. Fill all fields.';
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
                            <div
                                ref={nodeRef}
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Autocomplete
                                    options={
                                        new storageValue('tracardi-api-urls').read() || []
                                    }
                                    value={endpoint}
                                    onChange={(e, v) => handleEndpoint(v)}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            onChange={({target}) => handleEndpoint(target.value)}
                                            label='API Endpoint URL'
                                            margin='normal'
                                            size="small"
                                            variant='outlined'
                                            placeholder="http://localhost:8686"
                                        />
                                    )}
                                />
                            </div>
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