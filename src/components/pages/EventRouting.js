import React, {useEffect, useState} from "react";
import {SlMinus, SlPlus} from "react-icons/sl";
import Paper from "@mui/material/Paper";
import PropertyField from "../elements/details/PropertyField";
import Grid from "@mui/material/Grid";
import {asyncRemote} from "../../remote_api/entrypoint";
import NoData from "../elements/misc/NoData";
import FlowDisplay from "../flow/FlowDetails";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import RuleForm from "../elements/forms/RuleForm";

const PlusMinusIcon = ({onChange}) => {
    const [expand, setExpand] = useState(false)

    const handleChange = () => {
        const state = !expand
        setExpand(state)
        if (onChange instanceof Function) {
            onChange(state)
        }
    }

    return !expand
        ? <SlPlus size={20} style={{marginRight: 5, cursor: "pointer"}} onClick={handleChange}/>
        : <SlMinus size={20} style={{marginRight: 5, cursor: "pointer"}} onClick={handleChange}/>
}

const EventRoutingRule = ({rule, onChange}) => {
    const [shadow, setShadow] = useState(1)
    return <Paper style={{margin: 5, padding: 10}} elevation={shadow} onMouseOver={() => setShadow(6)}
                  onMouseOut={() => setShadow(1)}>
        <PropertyField name="Rule name" content={rule.name} labelWidth={200}>
            <RuleForm init={rule} onEnd={onChange}/>
        </PropertyField>
        <PropertyField name="Event source" content={rule.source.name} labelWidth={200}>
            <EventSourceDetails id={rule.source.id}/>
        </PropertyField>
        <PropertyField name="Workflow" content={rule.flow.name} underline={false} labelWidth={200}>
            <FlowDisplay id={rule.flow.id}/>
        </PropertyField>
    </Paper>
}

const EventRoutingRuleTree = ({rule, onChange}) => {

    const [expand, setExpand] = useState(false)


    return <div style={{flexDirection: "column", marginBottom: 5}}>
        <div className="flexLine" style={{width: "100%"}}>
            <PlusMinusIcon onChange={(v) => setExpand(v)}/>
            <Paper style={{padding: "5px 10px"}} elevation={3}>
                {rule.event.type}
            </Paper>
        </div>
        {expand && <Grid container style={{margin: 10, display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
            {rule['_inner_hits'].types.result.map((item, index) => <Grid item xs={12} md={6} lg={4}
                                                                         xl={3} key={index}>
                <EventRoutingRule rule={item} onChange={onChange}/></Grid>)}
        </Grid>}
    </div>
}

const EventTypesToRules = () => {

    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(1);

    useEffect(() => {
        asyncRemote({
            url: '/rules/by_event_type'
        }).then(response => {
            setData(response.data)
        })
    }, [refresh])

    if (Array.isArray(data.result)) {
        return <div style={{
            margin: 10,
            padding: "20px 20px",
            backgroundColor: "#dfdfdf",
            borderRadius: 10
        }}>{data.result.map((rule, index) => <EventRoutingRuleTree
            key={index} rule={rule}
            onChange={() => setRefresh(refresh + 1)}/>)}</div>
    }

    return <NoData header="No routing rules defined"/>
}

export default EventTypesToRules;