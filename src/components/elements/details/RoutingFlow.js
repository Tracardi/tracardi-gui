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
import {EventValidationCard} from "./EventValidationDetails";
import {EventReshapingCard} from "./EventReshapingDetails";
import {EventMetaDataCard} from "./EventMataDataDetails";
import {IdentificationPointCard} from "./IdentificationPointDetails";
import EventToProfileDetails, {EventToProfileCard} from "./EventToProfileDetails";
import {RuleCard} from "./RuleDetails";
import Button from "../forms/Button";
import FormDrawer from "../drawers/FormDrawer";
import EventValidationForm from "../forms/EventValidationForm";
import {BsPlusCircleDotted} from "react-icons/bs";
import EventReshapingForm from "../forms/EventReshapingForm";
import EventMetadataForm from "../forms/EventMetadataForm";
import IdentificationPointForm from "../forms/IdentifiactionPointForm";
import RuleForm from "../forms/RuleForm";
import CircularProgress from "@mui/material/CircularProgress";
import EventToProfileForm from "../forms/EventToProfileForm";

function hasData(data) {
    return Array.isArray(data) && data.length > 0
}

const BigStepLabel = ({children, optional, ...props}) =>
    <StepLabel {...props} optional={<span style={{fontSize: 13}}>{optional}</span>}
               style={{lineHeight: "1em", cursor: "pointer"}}>
        <span style={{fontSize: 18}}>{children}</span>
    </StepLabel>

const BigStepContent = ({children}) => <StepContent>
    <div style={{padding: "10px 30px 30px 30px", width: 1000}}>{children}</div>
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

const AccordionCard = ({items, nodata, details, passData, singleValue=false, displayMetadata, add, onDeleteComplete, onEditComplete, onAddComplete}) => {
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
        {add && <div style={{display: "flex", justifyContent: "end", marginBottom: 5}}>
            <Button label={singleValue ? "Add or Replace ":"Add"} onClick={() => setOpenAddDrawer(true)} icon={<BsPlusCircleDotted/>}/>
        </div>}
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

const ProcessStepAccordion = ({data, passData, singleValue=false, nodata, details, add, onChange}) => {

    return <AccordionCard items={data.result}
                          nodata={nodata}
                          details={details}
                          add={add}
                          passData={passData}
                          displayMetadata={false}
                          onDeleteComplete={onChange}
                          onAddComplete={onChange}
                          singleValue={singleValue}
                          onEditComplete={onChange}
    />
}

// const RoutingStep = ({endpoint, passData, singleValue=false, nodata, details, add, onChange, onLoad, onLoading}) => {
//
//     const [data, setData] = useState([])
//     const [refresh, setRefresh] = useState(0)
//
//     useEffect(() => {
//         if(onLoading instanceof Function) onLoading(true)
//         asyncRemote(endpoint).then(response => {
//             let _data;
//
//             if(onLoad instanceof Function) {
//                 _data = onLoad(response)
//             } else {
//                 _data = response.data
//             }
//             setData(_data)
//         }).catch(e => {
//             setData([])
//         }).finally(() => {
//             if(onLoading instanceof Function) onLoading(false)
//         })
//     }, [endpoint, refresh])
//
//     const handleChange = () => {
//         setRefresh(refresh + 1)
//         if (onChange instanceof Function) {
//             onChange()
//         }
//     }
//
//     return <AccordionCard items={data.result}
//                           nodata={nodata}
//                           details={details}
//                           add={add}
//                           passData={passData}
//                           displayMetadata={false}
//                           onDeleteComplete={handleChange}
//                           onAddComplete={handleChange}
//                           singleValue={singleValue}
//                           onEditComplete={handleChange}
//     />
// }

const ProcessStep = ({step, label, optional, endpoint, passData, singleValue, nodata, details, add, onLoad}) => {

    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState(false)
    const [data, setData] = useState([])
    const [refresh, setRefresh] = useState(0)

    useEffect(() => {
        if(endpoint?.url) {
            setLoading(true)
            asyncRemote(endpoint).then(response => {
                let _data;

                if(onLoad instanceof Function) {
                    _data = onLoad(response)
                } else {
                    _data = response.data
                }
                setData(_data)
                if(hasData(_data.result)) setActive(true)
            }).catch(e => {
                setData([])
            }).finally(() => {
                setLoading(false)
            })
        }

    }, [endpoint, refresh])

    const handleChange = () => {
        setRefresh(refresh+1)
    }

    return <Step active={active}>
        <BigStepLabel optional={<span style={{fontSize: 13}}>{optional}</span>}
                      onClick={() => setActive(!active)}
                      style={{cursor: "pointer"}}
                      icon={loading ? <CircularProgress size={24}/> : step}
        >
            {label}
        </BigStepLabel>
        <BigStepContent>
            <AccordionCard items={data.result}
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

const RoutingFlow = ({event}) => {

    return (
        <Box>
            <Stepper orientation="vertical">
                <ProcessStep step={"1"}
                             label="Data Validation"
                             optional="How was the data validated"
                             endpoint={{url: `/event-validators/by_type/${event.type}?only_enabled=false`}}
                             passData={true}
                             nodata="No validation"
                             details={EventValidationCard}
                             add={EventValidationForm}
                />
                <ProcessStep step={"2"}
                             label="Event Reshaping"
                             optional="How was the data changed"
                             endpoint={{url: `/event-reshape-schemas/by_type/${event.type}?only_enabled=false`}}
                             passData={true}
                             nodata="No reshaping"
                             details={EventReshapingCard}
                             add={EventReshapingForm}
                />
                {/*<Step key={"reshaping"} active={reshapingStep}>*/}
                {/*    <BigStepLabel optional="How was the data changed" onClick={() => setReshapingStep(!reshapingStep)}*/}
                {/*                  style={{cursor: "pointer"}}*/}
                {/*                  icon={null}*/}
                {/*    >*/}
                {/*        Event Reshaping*/}
                {/*    </BigStepLabel>*/}
                {/*    <BigStepContent>*/}
                {/*        <RoutingStep*/}
                {/*            endpoint={{url: `/event-reshape-schemas/by_type/${event.type}?only_enabled=false`}}*/}
                {/*            passData={true}*/}
                {/*            nodata="No reshaping"*/}
                {/*            details={EventReshapingCard}*/}
                {/*            add={EventReshapingForm}*/}
                {/*        />*/}
                {/*    </BigStepContent>*/}
                {/*</Step>*/}
                <ProcessStep step={"3"}
                             label="Event Indexing"
                             optional="How was the data indexed"
                             endpoint={{url: `/event-type/management/${event.type}`}}
                             nodata="No indexing"
                             passData={true}
                             singleValue={true}
                             details={EventMetaDataCard}
                             add={EventMetadataForm}  // requires onSubmit
                             onLoad={(response) => { return {
                                 result: [response.data],
                                 total: 1
                             }}}
                />
                {/*<Step key={"indexing"} active={indexingStep}>*/}
                {/*    <BigStepLabel optional="Event indexing"*/}
                {/*                  onClick={() => setIndexingStep(!indexingStep)}*/}
                {/*                  style={{cursor: "pointer"}}>*/}
                {/*        <span style={{fontSize: 18}}>Event Indexing</span>*/}
                {/*    </BigStepLabel>*/}
                {/*    <BigStepContent>*/}
                {/*        <RoutingStep */}
                {/*            endpoint={{url: `/event-type/management/${event.type}`}}*/}
                {/*                     nodata="No indexing"*/}
                {/*                     passData={true}*/}
                {/*                     singleValue={true}*/}
                {/*                     details={EventMetaDataCard}*/}
                {/*                     add={EventMetadataForm}  // requires onSubmit*/}
                {/*                     onLoad={(response) => { return {*/}
                {/*                         result: [response.data],*/}
                {/*                         total: 1*/}
                {/*                     }}}*/}
                {/*        />*/}
                {/*    </BigStepContent>*/}
                {/*</Step>*/}
                <ProcessStep step={"4"}
                             label="Identification check point"
                             optional="Is this event used to identify a customer"
                             endpoint={{url: `/identification/points/by_type/${event.type}`}}
                             nodata="This event is not an identification point"
                             details={IdentificationPointCard}
                             passData={true}
                             add={IdentificationPointForm}  // requires onSubmit
                />
                {/*<Step key={"identification"} active={identificationStep}>*/}
                {/*    <BigStepLabel optional="Is this event used to identify a customer"*/}
                {/*                  onClick={() => setIdentificationStep(!identificationStep)}*/}
                {/*                  style={{cursor: "pointer"}}>*/}
                {/*        Identification check point*/}
                {/*    </BigStepLabel>*/}
                {/*    <BigStepContent>*/}
                {/*        <RoutingStep */}
                {/*            endpoint={{url: `/identification/points/by_type/${event.type}`}}*/}
                {/*                     nodata="This event is not an identification point"*/}
                {/*                     details={IdentificationPointCard}*/}
                {/*                     passData={true}*/}
                {/*                     add={IdentificationPointForm}  // requires onSubmit*/}

                {/*        />*/}
                {/*    </BigStepContent>*/}
                {/*</Step>*/}
                <ProcessStep step={"5"}
                             label="Event to profile"
                             optional="How the date is transferred form event to profile"
                             endpoint={{url: `/event-to-profile/${event.type}`}}
                             nodata="No data is copied to profile"
                             details={EventToProfileCard}
                             add={EventToProfileForm}
                             passData={true}
                             singleValue={true}
                             onLoad={(response) => {
                                 return {
                                     result: [response.data],
                                     total: 1
                                 }
                             }}
                />
                {/*<Step key={"coping"} active={copingStep}>*/}
                {/*    <BigStepLabel optional="How the date is transferred form event to profile"*/}
                {/*                  onClick={() => setCopingStep(!copingStep)} style={{cursor: "pointer"}}>*/}
                {/*        Event to profile*/}
                {/*    </BigStepLabel>*/}
                {/*    <BigStepContent>*/}
                {/*        <RoutingStep */}
                {/*            endpoint={{url: `/event-to-profile/${event.type}`}}*/}
                {/*                     nodata="No data is copied to profile"*/}
                {/*                     details={EventToProfileDetails}*/}
                {/*                     passData={false}*/}
                {/*                     singleValue={true}*/}
                {/*                     onLoad={(response) => {*/}
                {/*                         return {*/}
                {/*                             result: [response.data],*/}
                {/*                             total: 1*/}
                {/*                         }*/}
                {/*                     }}*/}
                {/*        />*/}
                {/*    </BigStepContent>*/}
                {/*</Step>*/}
                <ProcessStep step={"6"}
                             label="Workflow"
                             optional="How the event was routed to the workflow"
                             endpoint={{url: `/rules/by_event_type/${event.type}`}}
                             nodata="This event is not routed any to workflow"
                             passData={true}
                             details={RuleCard}
                             add={RuleForm}
                />
                {/*<Step key={"routing"} active={workflowStep}>*/}
                {/*    <BigStepLabel optional="How the event was routed to the workflow"*/}
                {/*                  onClick={() => setWorkflowStep(!workflowStep)} style={{cursor: "pointer"}}>*/}
                {/*        Workflow*/}
                {/*    </BigStepLabel>*/}
                {/*    <BigStepContent>*/}
                {/*        <RoutingStep */}
                {/*            endpoint={{url: `/rules/by_event_type/${event.type}`}}*/}
                {/*                     nodata="This event is not routed any to workflow"*/}
                {/*                     passData={true}*/}
                {/*                     details={RuleCard}*/}
                {/*                     add={RuleForm}*/}
                {/*        />*/}
                {/*    </BigStepContent>*/}
                {/*</Step>*/}
            </Stepper>
        </Box>)
}

export default RoutingFlow;