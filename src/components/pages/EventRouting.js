import React, {useEffect, useState} from "react";
import {SlMinus, SlPlus} from "react-icons/sl";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {asyncRemote} from "../../remote_api/entrypoint";
import NoData from "../elements/misc/NoData";
import RoutingFlow from "../elements/details/RoutingFlow";
import Chip from "@mui/material/Chip";


const PlusMinusIcon = ({expand, onChange}) => {

    const handleChange = () => {
        const state = !expand
        if (onChange instanceof Function) {
            onChange(state)
        }
    }

    return !expand
        ? <SlPlus size={20} style={{marginRight: 5, cursor: "pointer"}} onClick={handleChange}/>
        : <SlMinus size={20} style={{marginRight: 5, cursor: "pointer"}} onClick={handleChange}/>
}

const EventTypeTree = ({event, onChange}) => {

    const [expand, setExpand] = useState(false)


    return <div style={{flexDirection: "column", marginBottom: 5}}>
        <div className="flexLine" style={{width: "100%"}}>
            <PlusMinusIcon expand={expand} onChange={(v) => setExpand(v)}/>
            <Paper style={{padding: "6px 20px", marginRight: 10, fontSize: 16,cursor: "pointer"}}
                   onClick={() => setExpand(!expand)}
                   elevation={6}>
                {event.type}
            </Paper>
            <div style={{padding: "5px 10px"}}>
                Event sources: {Array.isArray(event.source) && event.source.map((src) => <Chip label={src.id} key={src.id}
                                                                                                              style={{marginRight: 2}}
                                                                                                              size="small"/>)}
            </div>
        </div>
        {expand && <Grid container style={{margin: 10, display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
            <RoutingFlow event={event}/>
        </Grid>
        }
    </div>
}

const EventTypesToRules = () => {

    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(1);


    useEffect(() => {
        asyncRemote({
            url: "/events/by-type/by-source"
        }).then((response) => {
            setData(response.data)
        })
    }, [refresh])


    if (Array.isArray(data)) {
        return <div style={{
            margin: 15,
            padding: "40px 30px 30px 30px",
            backgroundColor: "#dfdfdf",
            borderRadius: 15
        }}>{data.map((event, index) => <EventTypeTree
            key={index} event={event}
            onChange={() => setRefresh(refresh + 1)}/>)}</div>
    }

    return <NoData header="No routing rules defined"/>
}

export default EventTypesToRules;