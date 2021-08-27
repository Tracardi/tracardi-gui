import React, {useEffect} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import "./ObjectList.css";
import Drawer from "@material-ui/core/Drawer";
import RightPaperHeader from "../RightPaperHeader";
import ObjectList from "./ObjectList";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

function DetailsObjectList({
                               label,
                               filterFields,
                               detailsLabel,
                               timeFieldLabel,
                               timeField,
                               onLoadRequest,
                               onLoadDetails,
                               detailsDrawerWidth,
                               displayDetails
                           }) {

    const [loading, setLoading] = React.useState(false);
    const [loadingDetails, setLoadingDetails] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [detailsToggle, setDetailsToggle] = React.useState(false);
    const [detailsData, setDetailsData] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        request(
            onLoadRequest,
            setLoading,
            setError,
            (value) => {
                if(value !== null) {
                    setReady(value);
                }
            }
        );
    }, [onLoadRequest])

    const drawerWidth = (detailsDrawerWidth) ? detailsDrawerWidth : 600;

    const openDetails = () => {
        setDetailsData(null);
        setDetailsToggle(true);
    }

    const closeDetails = () => {
        setDetailsToggle(false);
    }

    const none = () => {
    }

    const onReady = (data) => {
        setDetailsData(data)
    }

    const onDetails = (id) => {
        if (typeof id === "undefined") {
            console.error("Undefined id in onDetails")
        } else if (onLoadDetails) {
            setLoadingDetails(true);
            openDetails();
            request(
                onLoadDetails(id),
                setLoadingDetails,
                setError,
                onReady
            );
        }
    }

    const useStyles = makeStyles((theme) => ({
        drawerPaper: {
            overflow: "hidden"
        },
    }));

    const classes = useStyles();

    return <React.Fragment>

        <ObjectList data={ready.data}
                    label={label}
                    loading={loading}
                    errors={error}
                    timeField={timeField}
                    timeFieldLabel={timeFieldLabel}
                    filterFields={filterFields}
                    onLoadDetails={onLoadDetails}
                    onDetails={onDetails}/>

        {onLoadDetails &&
        <Drawer anchor="right" open={detailsToggle} onClose={closeDetails} classes={{paper: classes.drawerPaper}}>
            <div style={{width: drawerWidth, height: "inherit"}}>
                <RightPaperHeader onClose={closeDetails}>
                    <span style={{fontWeight: 600}}>{detailsLabel}</span>
                </RightPaperHeader>
                {loadingDetails && <CenteredCircularProgress/>}
                {detailsData && displayDetails && displayDetails(detailsData.data)}
            </div>
        </Drawer>}
    </React.Fragment>
}

export default DetailsObjectList