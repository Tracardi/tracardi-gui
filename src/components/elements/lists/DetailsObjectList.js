import React, {useEffect, useRef} from "react";
import "./ObjectList.css";
import Drawer from "@mui/material/Drawer";
import makeStyles from '@mui/styles/makeStyles';
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import AutoLoadObjectList from "./AutoLoadObjectList";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";

function DetailsObjectList({
                               label,
                               filterFields,
                               timeFieldLabel,
                               timeField,
                               onLoadRequest,
                               onLoadDetails,
                               detailsDrawerWidth,
                               displayDetails,
                               refreshInterval=0
                           }) {


    const [loadingDetails, setLoadingDetails] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [detailsToggle, setDetailsToggle] = React.useState(false);
    const [detailsData, setDetailsData] = React.useState(null);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const drawerWidth = (detailsDrawerWidth) ? detailsDrawerWidth : 600;

    const openDetails = () => {
        setDetailsData(null);
        setDetailsToggle(true);
    }

    const closeDetails = () => {
        setDetailsToggle(false);
    }

    const onDetails = async (id) => {
        if (typeof id === "undefined") {
            console.error("Undefined id in onDetails")
        } else if (onLoadDetails) {

            if (mounted.current) {
                setLoadingDetails(true);
                openDetails();
            }

            try {
                const response = await asyncRemote(onLoadDetails(id))
                if (mounted.current) {
                    setDetailsData(response?.data);
                    setError(null);
                }
            } catch (e) {
                if (mounted.current) {
                    setDetailsData(null);
                    setError(getError(e));
                }
            } finally {
                if (mounted.current) {
                    setLoadingDetails(false);
                }
            }
        }
    }

    const useStyles = makeStyles(() => ({
        drawerPaper: {
            overflow: "hidden"
        },
    }));

    const classes = useStyles();

    return <React.Fragment>

        <AutoLoadObjectList
            label={label}
            timeField={timeField}
            timeFieldLabel={timeFieldLabel}
            filterFields={filterFields}
            onLoadDetails={onLoadDetails}
            onDetails={onDetails}
            onLoadRequest={onLoadRequest}
            refreshInterval={refreshInterval}
        />

        {onLoadDetails &&
        <Drawer anchor="right" open={detailsToggle} onClose={closeDetails} classes={{paper: classes.drawerPaper}}>
            <div style={{width: drawerWidth, height: "inherit"}}>
                {loadingDetails && <CenteredCircularProgress/>}
                {error !== null && <ErrorsBox errorList={error}/> }
                {detailsData && displayDetails && displayDetails(detailsData)}
            </div>
        </Drawer>}
    </React.Fragment>
}

export default DetailsObjectList