import React, {useEffect, useState} from "react";
import TuiPieChart from "../elements/charts/PieChart";
import {asyncRemote} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ProfileEventHeatMap from "../elements/details/ProfileEventHeatMap";

export default function Dashboard() {

    const [eventsByType, setEventsByType] = useState([]);
    const [eventsByTag, setEventsByTag] = useState([]);
    const [eventsBySource, setEventsBySource] = useState([]);
    const [loadingByType, setLoadingByType] = useState(false);
    const [loadingByTag, setLoadingByTag] = useState(false);
    const [loadingBySource, setLoadingBySource] = useState(false);

    useEffect(() => {
        setLoadingByType(true);
        asyncRemote({
            url: "events/by_type"
        }).then((resposne) => {
            if(resposne) {
                setEventsByType(resposne.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByType(false)
        })
    }, [])

    useEffect(() => {
        setLoadingByTag(true);
        asyncRemote({
            url: "events/by_tag"
        }).then((resposne) => {
            if(resposne) {
                setEventsByTag(resposne.data)
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingByTag(false)
        })
    }, [])

    useEffect(() => {
        setLoadingBySource(true);
        asyncRemote({
            url: "events/by_source"
        }).then((resposne) => {
            if(resposne) {
                setEventsBySource(resposne.data);
                console.log(resposne.data);
            }
        }).catch(() => {

        }).finally(() => {
            setLoadingBySource(false)
        })
    }, [])

    const PieChart= ({loading, data, header, fill="#444"}) => {
        return <div>
            {header && <header style={{display: "flex", justifyContent: "center"}}>{header}</header>}
            <div style={{width: 350, height: 230}}>
                {!loading && <TuiPieChart data={data} fill={fill}/>}
                {loading && <CenteredCircularProgress/>}
            </div>
        </div>

    }

    return <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "flex", flexDirection: "row"}}>
            <PieChart header="Events by type" loading={loadingByType} data={eventsByType} />
            <PieChart header="Events by tag"  loading={loadingByTag} data={eventsByTag} />
            <PieChart header="Events by source"  loading={loadingBySource} data={eventsBySource} />
            <header>Running instances</header>
            <header>Profiles no.</header>
            <header>Sessions no.</header>
            <header>Events per month</header>
            <header>Profiles per month</header>
            <header>Interests by type</header>
        </div>
        <div>
            <ProfileEventHeatMap/>
        </div>

    </div>


}
