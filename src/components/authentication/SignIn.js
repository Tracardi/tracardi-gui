import React, {useState} from 'react';
import {Redirect, useLocation} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {setRoles, setToken} from "./login";
import {loginUser} from "../../remote_api/user";
import {signInTheme} from "../../themes";
import {showAlert} from "../../redux/reducers/alertSlice";
import {connect} from "react-redux";
import urlPrefix from "../../misc/UrlPrefix";

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

    const classes = useStyles();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {state} = useLocation();
    const {from} = state || {from: {pathname: urlPrefix("/home")}};
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value);
    }

    const handlePassChange = (evt) => {
        setPassword(evt.target.value);
    }

    const onSubmit = event => {
        const api = loginUser(email, password);
        api
            .then(response => {
                setToken(response.data['access_token']);
                setRoles(response.data['roles'])
                setRedirectToReferrer(true);
            })
            .catch(e => {
                let message = e.message;
                if(typeof e.response == "undefined") {
                    message = 'Api unavailable.';
                } else if(e.response.status === 422) {
                    message = 'Bag request. Fill all fields.';
                } else if(typeof e.response.data['detail'] == "string") {
                    message = e.response.data['detail']
                }
                showAlert({type: "error", message: message, hideAfter: 3000})
            })

        event.preventDefault();
    };

    if (redirectToReferrer) {
        return <Redirect to={from}/>;
    }

    return (
        <ThemeProvider theme={signInTheme}>
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form onSubmitCapture={onSubmit} className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleEmailChange}/>
                        <TextField
                            style={{color: "black"}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handlePassChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}

                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                            </Grid>
                        </Grid>
                    </form>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </div>
            </Container>
        </ThemeProvider>
    );
}

export default connect(
    null,
    {showAlert}
)(SignInForm)