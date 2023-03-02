import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import NoData from "../misc/NoData";
import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {StatusPoint} from "../misc/StatusPoint";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {BsXCircle, BsBoxArrowDown} from "react-icons/bs";
import EventValidationDetails from "./EventValidationDetails";
import EventReshapingDetails from "./EventReshapingDetails";
import EventMataDataDetails from "./EventMataDataDetails";
import IdentificationPointDetails from "./IdentificationPointDetails";
import EventToProfileDetails from "./EventToProfileDetails";
import RuleDetails from "./RuleDetails";

function hasData(data) {
    return Array.isArray(data) && data.length >0
}

const BigStepLabel = ({children, optional, ...props}) =>
    <StepLabel {...props} optional={<span style={{fontSize: 13}}>{optional}</span>}
               style={{lineHeight: "1em", cursor: "pointer"}}>
        <span style={{fontSize: 18}}>{children}</span>
    </StepLabel>

const BigStepContent = ({children}) => <StepContent>
    <div style={{padding: "10px 30px 30px 30px"}}>{children}</div>
</StepContent>

const Card = ({children}) => {
    return <Paper style={{padding: 20}} elevation={6}>
        {children}
    </Paper>
}

const EnabledChip = ({item}) => {
    return <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 10px 5px 20px",
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        marginRight: 2,
        borderRadius: 10,
        fontSize: 14,
        height: 30
    }}>
        {item?.name} <StatusPoint status={item?.enabled}/>
    </span>
}

const AccordionCard = ({items, nodata, details}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if(!hasData(items))
        return <Card><NoData header={nodata}
                             fontSize="1.5em"
                             icon={<BsXCircle size={30}/>}
                             style={{minWidth: 550}}/></Card>

    return  Array.isArray(items) && items.map((item, index) => <Accordion
        sx ={{minWidth: 700}}
        expanded={expanded === index}
        key={item.id}
        onChange={handleChange(index)}
    >
        <AccordionSummary
            expandIcon={<BsBoxArrowDown size={24}/>}
        >
            <div className="flexLine">
                <EnabledChip item={item}/>
                <Typography sx={{ color: 'text.secondary', marginLeft: 1, marginRight: 1}}>{item.description}</Typography>
            </div>

        </AccordionSummary>
        <AccordionDetails>
            {details && React.createElement(
                details,
                {id: item.id},
                null
            )}
        </AccordionDetails>
    </Accordion>)
}

const RoutingFlow = ({event}) => {

    const [rules, setRules] = useState([])
    const [validation, setValidation] = useState([])
    const [reshaping, setReshaping] = useState([])
    const [indexing, setIndexing] = useState([])
    const [identification, setIdentification] = useState([])
    const [coping, setCoping] = useState([])
    const [validationStep, setValidationStep] = useState(false)
    const [reshapingStep, setReshapingStep] = useState(false)
    const [indexingStep, setIndexingStep] = useState(false)
    const [copingStep, setCopingStep] = useState(false)
    const [identificationStep, setIdentificationStep] = useState(false)
    const [workflowStep, setWorkflowStep] = useState(false)
    const [destinationStep, setDestinationStep] = useState(false)



    useEffect(() => {
        asyncRemote({
            url: `/event-validators/by_type/${event.type}?only_enabled=false`
        }).then(response => {
            setValidation(response.data)
            setValidationStep(hasData(response.data.result))
            console.log(validation)
        }).catch(e => {

        })
        asyncRemote({
            url: `/event-reshape-schemas/by_type/${event.type}?only_enabled=false`
        }).then(response => {
            setReshaping(response.data)
            setReshapingStep(hasData(response.data.result))
        }).catch(e => {
            console.log(e.status)
        })

        asyncRemote({
            url: `/event-type/management/${event.type}`
        }).then(response => {
            setIndexing({
                result: [response.data],
                total: 1
            })
            setIndexingStep(response.data)
        }).catch(e => {
            console.log(e.status)
        })

        asyncRemote({
            url: `/event-to-profile/${event.type}`
        }).then(response => {
            setCoping({
                result: [response.data],
                total: 1
            })
            setCopingStep(response.data)
        }).catch(e => {
            console.log(e.status)
        })

        asyncRemote({
            url: `/identification/points/by_type/${event.type}`
        }).then(response => {
            setIdentification(response.data)
            setIdentificationStep(hasData(response.data.result))
        }).catch(e => {
            console.log(e.status)
        })

        asyncRemote({
            url: `/rules/by_event_type/${event.type}`
        }).then(response => {
            setRules(response.data)
            setWorkflowStep(hasData(response.data.result))
        })


    }, [])

    return (
        <Box>
            <Stepper orientation="vertical">
                <Step key={"validation"} active={validationStep}>
                    <BigStepLabel optional={<span style={{fontSize: 13}}>How was the data validated</span>} onClick={() => setValidationStep(!validationStep)} style={{cursor: "pointer"}}>
                        Data Validation
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={validation.result}
                                       nodata="No validation"
                                       details={EventValidationDetails}/>
                    </BigStepContent>
                </Step>
                <Step key={"reshaping"} active={reshapingStep}>
                    <BigStepLabel optional="How was the data changed" onClick={() => setReshapingStep(!reshapingStep)}
                               style={{cursor: "pointer"}}>
                        Event Reshaping
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={reshaping.result}
                                       nodata="No reshaping"
                                       details={EventReshapingDetails}/>
                    </BigStepContent>
                </Step>
                <Step key={"indexing"} active={indexingStep}>
                    <BigStepLabel optional="Event indexing"
                               onClick={() => setIndexingStep(!indexingStep)}
                               style={{cursor: "pointer"}}>
                        <span style={{fontSize: 18}}>Event Indexing</span>
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={indexing.result}
                                       nodata="No indexing"
                                       details={EventMataDataDetails}
                        />
                    </BigStepContent>
                </Step>
                <Step key={"identification"} active={identificationStep}>
                    <BigStepLabel optional="Is this event used to identify a customer"
                               onClick={() => setIdentificationStep(!identificationStep)} style={{cursor: "pointer"}}>
                        Identification check point
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={identification.result}
                                       nodata="This event is not an identification point"
                                       details={IdentificationPointDetails}/>
                    </BigStepContent>
                </Step>
                <Step key={"coping"} active={copingStep}>
                    <BigStepLabel optional="How the date is transferred form event to profile"  onClick={() => setCopingStep(!copingStep)} style={{cursor: "pointer"}}>
                        Event to profile
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={coping.result}
                                       nodata="No data is copied to profile"
                                       details={EventToProfileDetails}/>
                    </BigStepContent>
                </Step>
                <Step key={"routing"} active={workflowStep}>
                    <BigStepLabel optional="How the event was routed to the workflow"  onClick={() => setWorkflowStep(!workflowStep)} style={{cursor: "pointer"}}>
                        Workflow
                    </BigStepLabel>
                    <BigStepContent>
                        <AccordionCard items={rules.result}
                        nodata="This event is not routed any to workflow"
                        details={RuleDetails}/>
                    </BigStepContent>
                </Step>
                <Step key={"destination"} active={destinationStep}>
                    <BigStepLabel optional="Where the profile will be sent"  onClick={() => setDestinationStep(!destinationStep)} style={{cursor: "pointer"}}>
                        Destinations
                    </BigStepLabel>
                    <BigStepContent>

                    </BigStepContent>
                </Step>
            </Stepper>
        </Box>)
}

export default RoutingFlow;