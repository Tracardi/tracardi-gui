import React, {useEffect, useRef} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import "./ObjectList.css";
import Drawer from "@material-ui/core/Drawer";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import AutoLoadObjectList from "./AutoLoadObjectList";

function DetailsObjectList({
                               label,
                               filterFields,
                               timeFieldLabel,
                               timeField,
                               onLoadRequest,
                               onLoadDetails,
                               detailsDrawerWidth,
                               displayDetails
                           }) {


    const [loadingDetails, setLoadingDetails] = React.useState(false);
    const [error, setError] = React.useState(false);
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

    const onReady = (data) => {
        setDetailsData(data)
    }

    const onDetails = async (id) => {
        if (typeof id === "undefined") {
            console.error("Undefined id in onDetails")
        } else if (onLoadDetails) {
            setLoadingDetails(true);
            openDetails();
            request(onLoadDetails(id),
                (state) => {
                    if (mounted.current) setLoadingDetails(state)
                },
                (e) => {
                    if (mounted.current) setError(e)
                },
                (data) => {
                    if (mounted.current) onReady(data)
                }
            );
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
            errors={error}
            timeField={timeField}
            timeFieldLabel={timeFieldLabel}
            filterFields={filterFields}
            onLoadDetails={onLoadDetails}
            onDetails={onDetails}
            onLoadRequest={onLoadRequest}
        />

        {onLoadDetails &&
        <Drawer anchor="right" open={detailsToggle} onClose={closeDetails} classes={{paper: classes.drawerPaper}}>
            <div style={{width: drawerWidth, height: "inherit"}}>
                {loadingDetails && <CenteredCircularProgress/>}
                {detailsData && displayDetails && displayDetails(detailsData.data)}
            </div>
        </Drawer>}
    </React.Fragment>
}

export default DetailsObjectList