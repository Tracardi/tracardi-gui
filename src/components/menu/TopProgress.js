import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import {connect} from "react-redux";

function TopProgress({progressBar}) {

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
        },
        progress: {
            background: 'transparent',
        },
    }));
    const classes = useStyles();

    return <div className={classes.root}>
        <LinearProgress className={classes.progress} color="secondary" variant="determinate" value={progressBar.progress}/>
    </div>
}

const mapProps = (state) => {
    return {
        progressBar: state.progressReducer,
    }
}

export default connect(mapProps)(TopProgress)
