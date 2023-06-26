import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import NoData from "../misc/NoData";
import React, {useState} from "react";
import {StatusPoint} from "../misc/StatusPoint";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import {BsXCircle, BsBoxArrowDown} from "react-icons/bs";
import {EventValidationCard} from "./EventValidationDetails";
import {EventReshapingCard} from "./EventReshapingDetails";
import {EventIndexingCard} from "./EventIndexingDetails";
import {IdentificationPointCard} from "./IdentificationPointDetails";
import {EventToProfileCard} from "./EventToProfileDetails";
import Button from "../forms/Button";
import FormDrawer from "../drawers/FormDrawer";
import EventValidationForm from "../forms/EventValidationForm";
import {BsPlusCircleDotted} from "react-icons/bs";
import EventReshapingForm from "../forms/EventReshapingForm";
import EventIndexingForm from "../forms/EventIndexingForm";
import IdentificationPointForm from "../forms/IdentifiactionPointForm";
import RuleForm from "../forms/RuleForm";
import CircularProgress from "@mui/material/CircularProgress";
import EventToProfileForm from "../forms/EventToProfileForm";
import FlowDisplay from "../../flow/FlowDetails";
import {useFetch} from "../../../remote_api/remoteState";
import FetchError from "../../errors/FetchError";
import {RestrictToLocalStagingContext} from "../../context/RestrictContext";
import {RuleCard} from "./RuleDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupHeader} from "../tui/TuiForm";

function hasData(data) {
    return Array.isArray(data) && data.length > 0
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

const AccordionCard = ({items, nodata, details, passData, singleValue = false, displayMetadata, add, onDeleteComplete, onEditComplete, onAddComplete}) => {
    const [expanded, setExpanded] = React.useState(false);
    const [openAddDrawer, setOpenAddDrawer] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function displayAccordion() {
        return Array.isArray(items) && items.map(item => <Accordion
            expanded={expanded === item.id}
            key={item?.id}
            onChange={handleChange(item.id)}
            elevation={6}
        >
            <AccordionSummary
                expandIcon={<BsBoxArrowDown size={24}/>}
            >
                <div className="flexLine">
                    <EnabledChip item={item}/>
                    <Typography
                        sx={{color: 'text.secondary', marginLeft: 1, marginRight: 1}}>{item?.description}</Typography>
                </div>

            </AccordionSummary>
            <AccordionDetails>
                {details && React.createElement(
                    details,
                    passData ? {
                        data: item, displayMetadata,
                        onDeleteComplete: onDeleteComplete,
                        onEditComplete: onEditComplete,
                    } : {
                        id: item?.id,
                        onDeleteComplete: onDeleteComplete,
                        onEditComplete: onEditComplete,
                    },
                    null
                )}
            </AccordionDetails>
        </Accordion>)
    }

    function displayNoData() {
        return <Card><NoData header={nodata}
                             fontSize="1.5em"
                             icon={<BsXCircle size={30}/>}
                             style={{minWidth: 550}}/></Card>
    }

    return <>
        {add && <RestrictToLocalStagingContext>
            <div style={{display: "flex", justifyContent: "end", marginBottom: 5}}>
                <Button label={singleValue ? "Add or Replace " : "Add"}
                        onClick={() => setOpenAddDrawer(true)}
                        icon={<BsPlusCircleDotted size={20}/>}/>
            </div>
        </RestrictToLocalStagingContext>}
        {(!hasData(items)) ? displayNoData() : displayAccordion()}
        {add && <FormDrawer
            width={800}
            onClose={() => {
                setOpenAddDrawer(false)
            }}
            open={openAddDrawer}>
            {openAddDrawer && React.createElement(
                add,
                {
                    onSubmit: () => {
                        setOpenAddDrawer(false);
                        if (onAddComplete instanceof Function) onAddComplete()
                    }
                },
                null
            )}
        </FormDrawer>}
    </>
}

const ProcessStep = ({step, label, optional, endpoint, passData, singleValue, nodata, details, add, onLoad}) => {

    const [active, setActive] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const {isLoading, data, error} = useFetch(
        [`Routing${step}`, [endpoint, refresh]],
        endpoint,
        (data) => {
            if (onLoad instanceof Function) {
                data = onLoad(data)
            }
            if (hasData(data.result)) setActive(true)
            return data;
        },
        {retry: 0}
    )

    const handleChange = () => {
        setRefresh(refresh + 1)
    }

    if (error) {
        if (error.status === 402) {
            nodata = "This feature is licensed."
        } else if (error.status !== 404) {
            return <FetchError error={error}/>
        }

    }

    return <Step active={active} xs={{width: "100%"}}>
        <BigStepLabel optional={<span style={{fontSize: 13}}>{optional}</span>}
                      onClick={() => setActive(!active)}
                      style={{cursor: "pointer"}}
                      icon={isLoading ? <CircularProgress size={24}/> : step}
        >
            <div className="flexLine" style={{justifyContent: "space-between"}}>{label} {hasData(data?.result) &&
            <span className="flexLine" style={{fontSize: 13}}>Running<StatusPoint status={true}/></span>}</div>
        </BigStepLabel>
        <BigStepContent>
            <AccordionCard items={data?.result}
                           nodata={nodata}
                           details={details}
                           add={add}
                           passData={passData}
                           displayMetadata={false}
                           onDeleteComplete={handleChange}
                           onAddComplete={handleChange}
                           singleValue={singleValue}
                           onEditComplete={handleChange}
            />
        </BigStepContent>
    </Step>
}

const PreviewFlow = ({data, onDeleteComplete, onEditComplete}) => {
    return <>
        <RuleCard data={data} displayMetadata={false}/>

        <TuiForm style={{margin:20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Workflow"/>
                <div style={{height: 700}}><FlowDisplay id={data.flow.id}/></div>
            </TuiFormGroup>

        </TuiForm>

    </>
}

const RoutingFlow = ({event}) => {

    return (
        <Box sx={{width: "100%"}}>
            <Stepper orientation="vertical">
                <ProcessStep step={"1"}
                             label="Data Validation"
                             optional="How was the data validated?"
                             endpoint={{url: `/event-validators/by_type/${event.type}?only_enabled=false`}}
                             passData={true}
                             nodata="No validation"
                             details={EventValidationCard}
                             add={EventValidationForm}
                />
                <ProcessStep step={"2"}
                             label="Event Reshaping"
                             optional="How was the event data transformed?"
                             endpoint={{url: `/event-reshape-schemas/by_type/${event.type}?only_enabled=false`}}
                             passData={true}
                             nodata="No reshaping"
                             details={EventReshapingCard}
                             add={EventReshapingForm}
                />
                <ProcessStep step={"3"}
                             label="Event Mapping"
                             optional="How was the data indexed?"
                             endpoint={{url: `/event-type/management/${event.type}`}}
                             nodata="No Mapping"
                             passData={true}
                             singleValue={true}
                             details={EventIndexingCard}
                             add={EventIndexingForm}  // requires onSubmit
                             onLoad={(data) => {
                                 return {
                                     result: [data],
                                     total: 1
                                 }
                             }}
                />
                <ProcessStep step={"4"}
                             label="Identification check point"
                             optional="Is this event used to identify a customer?"
                             endpoint={{url: `/identification/points/by_type/${event.type}`}}
                             nodata="This event is not an identification point"
                             details={IdentificationPointCard}
                             passData={true}
                             add={IdentificationPointForm}  // requires onSubmit
                />
                <ProcessStep step={"5"}
                             label="Event to profile mapping"
                             optional="How the data is transferred from event to profile?"
                             endpoint={{url: `/event-to-profiles/type/${event.type}`}}
                             nodata="No data is copied to profile"
                             details={EventToProfileCard}
                             add={EventToProfileForm}
                             passData={true}
                />
                <ProcessStep step={"6"}
                             label="Workflow"
                             optional="How the event was routed to the workflow to be processed?"
                             endpoint={{url: `/rules/by_event_type/${event.type}`}}
                             nodata="This event is not routed any to workflow"
                             passData={true}
                             details={PreviewFlow}
                             add={RuleForm}
                />
            </Stepper>
        </Box>)
}

export default RoutingFlow;