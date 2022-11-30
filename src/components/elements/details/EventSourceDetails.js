import React, {Suspense, useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./ResourceDetails.css";
import "./Details.css";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventSourceForm from "../forms/EventSourceForm";
import TextField from "@mui/material/TextField";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import TuiPieChart from "../charts/PieChart";
import BarChartElement from "../charts/BarChart";
import ErrorsBox from "../../errors/ErrorsBox";
import {SelectInput} from "../forms/JsonFormComponents";
import NoData from "../misc/NoData";
import NotImplemented from "../misc/NotImplemented";
import MarkdownElement from "../misc/MarkdownElement";
import TuiTags from "../tui/TuiTags";
import PropertyField from "./PropertyField";
import IdLabel from "../misc/IconLabels/IdLabel";
import DateValue from "../misc/DateValue";
import ActiveTag from "../misc/ActiveTag";
import DocsLink from "../drawers/DocsLink";
import {BsStar} from "react-icons/bs";
import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";


const TrackerUseScript = React.lazy(() => import('../tracker/TrackerUseScript'));
const TrackerScript = React.lazy(() => import('../tracker/TrackerScript'));

export default function EventSourceDetails({id, onDeleteComplete}) {

    const confirm = useConfirm();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);
    const [tab, setTab] = React.useState(0);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
            url: '/event-source/' + id,
            method: "GET"
        }).then((response) => {
            if (response) {
                setData(response.data);
            }
        }).catch((e) => {
            if (e) {
                console.error(e)
            }
        }).finally(() => {
            setLoading(false);
        })
    }, [id])

    // Loads data without loading indicator
    useEffect(() => {
        asyncRemote({
            url: '/event-source/' + id,
            method: "GET"
        }).then((response) => {
            if (response) {
                setData(response.data);
            }
        }).catch((e) => {
            if (e) {
                console.error(e)
            }
        })
    }, [id, refresh])

    const onEdit = () => {
        setEditData(data)
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this event source?",
            description: "This action can not be undone."
        }).then(async () => {
            try {
                const response = await asyncRemote({
                    url: '/event-source/' + data.id,
                    method: "DELETE"
                })
                if (onDeleteComplete) {
                    onDeleteComplete(response)
                }
            } catch (e) {
                console.error(e);
            }

        }).catch(() => {
        })
    }

    const Details = () => <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Event Source"/>
                <TuiFormGroupContent header={"Data"}>
                    {data && <>
                        <PropertyField labelWidth={400} name="Id" content={<IdLabel label={data.id}/>}/>
                        <PropertyField labelWidth={400} name="Type" content={data.type}/>
                        <PropertyField labelWidth={400} name="Created" content={<DateValue date={data.timestamp}/>}/>
                        <PropertyField labelWidth={400} name="Active" content={<ActiveTag active={data.enabled}/>}/>
                        <PropertyField labelWidth={400} name="Synchronize profiles" content={<ActiveTag active={data.synchronize_profiles}/>}/>
                        <PropertyField labelWidth={400} name="Transitional" content={<ActiveTag active={data.transitional}/>}/>
                        <PropertyField labelWidth={400} name="Return profile" content={<ActiveTag active={data.returns_profile}/>}/>
                        <PropertyField labelWidth={400} name="Make profile id permanent" content={<ActiveTag active={data.permanent_profile_id}/>}/>
                        <PropertyField labelWidth={400} name="Require consent" content={<ActiveTag active={data.requires_consent}/>}/>
                        <PropertyField labelWidth={400} name="Groups" content={<TuiTags tags={data.groups} size="small"/>}/>
                        <PropertyField labelWidth={400} name="Tags" content={<TuiTags tags={data.tags} size="small"/>}/>
                        {data.locked &&
                        <NotImplemented style={{marginTop: 10}}>This event source is managed by external service.
                            Therefore
                            it can not be edited in the system.</NotImplemented>}
                    </>}
                </TuiFormGroupContent>

            </TuiFormGroup>
        </TuiForm>


        {data.type === "rest" && <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Integration"
                                    description={
                                        <>
                                            <span>Please paste this code into your web page. This code should appear on every page.</span>
                                            <DocsLink src="http://docs.tracardi.com/integration/js-integration/">Do you
                                                need help?</DocsLink>
                                        </>
                                    }/>
                <TuiFormGroupContent>
                    <Suspense fallback={<CenteredCircularProgress/>}><TrackerScript sourceId={data.id}/></Suspense>
                </TuiFormGroupContent>
            </TuiFormGroup>

            <TuiFormGroup>
                <TuiFormGroupHeader header="Javascript example"
                                    description="This is an example of event sending. This code sends multiple events.
                                    Please refer to Tracardi documentation on more complex configuration."/>
                <TuiFormGroupContent>
                    <Suspense fallback={<CenteredCircularProgress/>}><TrackerUseScript/></Suspense>
                </TuiFormGroupContent>
            </TuiFormGroup>

            <TuiFormGroup>
                <TuiFormGroupHeader header="Webhook"
                                    description="For every event source there is a webhook created. Calling it will emit
                                profile less event. For full fledged events call regular /track endpoint."/>
                <TuiFormGroupContent>
                    <h3 className="flexLine"><BsStar size={20} style={{marginRight: 5}}/> Webhook URL</h3>
                    <p>Event properties should be send in the body of request or as URL parameters
                        and <b>event-type</b> inside URL should be
                        replaced with the event type you would like to emit. Please refer to the documentation to see
                        what are profile less events as calling this web hook will emit one of them.
                        <DocsLink src="http://docs.tracardi.com/events/event_tracking/#profile-less-events">Profile-less event documentation</DocsLink>
                    </p>

                    <TextField
                        label="Web hook"
                        value={`/collect/event-type/${data.id}`}
                        size="small"
                        disabled={true}
                        variant="outlined"
                        fullWidth
                    />

                    <h3 className="flexLine"><BsStar size={20} style={{marginRight: 5}}/> Webhook URL with session</h3>
                    <p>If you can add session ID to your url then the user profile will be recreated. Use this webhook
                        if you have access to tracardi user session. Replace `session_id` with user <b>session id</b> and
                        type your event type instead of <b>event-type</b>. Event properties
                        should be send in the body of request or as URL parameters.
                    </p>

                    <TextField
                        label="Web hook with session "
                        value={`/collect/event-type/${data.id}/session_id`}
                        size="small"
                        disabled={true}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        }
    </>

    const EventSourceAnalytics = () => {

        const [timeRange, setTimeRange] = React.useState("w");
        const [groupedByType, setGroupedByType] = React.useState(null);
        const [groupedByTag, setGroupedByTag] = React.useState(null);
        const [error, setError] = React.useState(null);
        const mounted = React.useRef(false);

        React.useEffect(() => {
            mounted.current = true;
            if (mounted.current === true) setError(null);

            asyncRemote({
                url: `/event/for-source/${id}/by-type/${timeRange}`
            })
                .then(response => {
                    if (mounted.current === true) setGroupedByType(response.data)
                })
                .catch(error => {
                    if (mounted.current === true) setError(getError(error))
                })

            asyncRemote({
                url: `/event/for-source/${id}/by-tag/${timeRange}`
            })
                .then(response => {
                    if (mounted.current === true) setGroupedByTag(response.data)
                })
                .catch(error => {
                    if (mounted.current === true) setError(getError(error))
                })

            return () => mounted.current = false;
        }, [timeRange])

        return <>
            {error !== null ?
                <ErrorsBox errorList={error}/>
                :
                <>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        margin: "0px 0px 40px",
                        borderBottom: "solid 1px #ccc",
                        padding: 10
                    }}>
                        <header style={{marginRight: 10}}>Please select time range</header>
                        <SelectInput
                            value={timeRange}
                            onChange={setTimeRange}
                            items={{
                                d: "Last day",
                                w: "Last week",
                                M: "Last month",
                                y: "Last year"
                            }}
                        />
                    </div>
                    <div style={{display: "flex"}}>
                        <div style={{width: "50%", height: "300px", overflow: "hidden"}}>
                            <header style={{display: "flex", justifyContent: "center"}}>Events by type
                            </header>
                            {groupedByType !== null ?
                                Array.isArray(groupedByType) && groupedByType.length > 0 ?
                                    <TuiPieChart data={groupedByType} fill="#1976d2"/>
                                    :
                                    <div style={{marginTop: 50}}><NoData
                                        header="No data"/></div>
                                :
                                <CenteredCircularProgress/>
                            }
                        </div>
                        <div style={{width: "50%", height: "300px", overflow: "hidden"}}>
                            <header style={{display: "flex", justifyContent: "center"}}>Events by tags
                            </header>
                            {groupedByTag !== null ?
                                Array.isArray(groupedByTag) && groupedByTag.length > 0 ?
                                    <TuiPieChart data={groupedByTag} fill="#1976d2"/>
                                    :
                                    <div style={{marginTop: 50}}><NoData
                                        header="No data"/></div>
                                :
                                <CenteredCircularProgress/>
                            }
                        </div>
                    </div>
                    <div style={{height: "220px"}}>
                        <header style={{display: "flex", justifyContent: "center"}}>Events time-line</header>
                        <BarChartElement
                            onLoadRequest={{
                                url: '/event/select/histogram?group_by=metadata.status',
                                method: "post",
                                data: {
                                    minDate: {
                                        delta: {
                                            type: "minus",
                                            value: -1,
                                            entity: {w: "week", y: "year", d: "day", M: "month"}[timeRange]
                                        }
                                    },
                                    where: "source.id:" + id
                                },
                                limit: 30,
                                page: 0
                            }}
                            barChartColors={{processed: "#00C49F", error: "#d81b60", collected: '#0088FE'}}
                        />
                    </div>
                </>
            }

        </>;
    };

    return <>
        {loading && <CenteredCircularProgress/>}
        {data && <>
            <div style={{display: "flex", margin: 30, flexDirection: "column"}}>

                <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
                        <h1 className="header"
                            style={{marginBottom: 0}}> {data.name} ({data.type})</h1>
                    </div>
                    <div style={{display: "flex", alignItems: "start"}}>
                        <Rows>
                            {data?.locked !== true && <Button onClick={onEdit}
                                                              icon={<VscEdit size={20}/>}
                                                              label="Edit"
                                                              disabled={typeof data === "undefined"}/>}
                            <Button onClick={onDelete}
                                    icon={<VscTrash size={20}/>}
                                    label="Delete"
                                    disabled={typeof data === "undefined"}/>
                        </Rows>
                    </div>

                </div>
                {data.description && <h2 className="subHeader">{data.description}</h2>}
                <div style={{marginBottom: 10}}>
                    <TuiTags tags={data.tags} style={{marginLeft: 5, marginTop: 10}}/>
                </div>

            </div>

            <Tabs
                tabs={["Details", "Analytics", "Raw"]}
                defaultTab={tab}
                onTabSelect={setTab}
                tabContentStyle={{overflow: "initial"}}
                tabsStyle={{
                    display: "flex",
                    backgroundColor: "white",
                    marginTop: 0,
                    marginBottom: 0,
                    position: "sticky",
                    top: 0,
                    zIndex: 2
                }}
            >
                <TabCase id={0} key="Details">
                    <Details/>
                    {data?.manual && <TuiForm style={{margin: 20}}>
                        <TuiFormGroup> <TuiFormGroupHeader header="Manual"/>
                            <TuiFormGroupContent>
                                <TuiFormGroupContent header="Manual">
                                    <MarkdownElement text={data.manual}/>
                                </TuiFormGroupContent>
                            </TuiFormGroupContent>
                        </TuiFormGroup>
                    </TuiForm>
                    }
                </TabCase>
                <TabCase id={1} key="Analytics">
                    <EventSourceAnalytics/>
                </TabCase>
                <TabCase id={2} key="Raw">
                    <div className="Box10">
                        <ObjectInspector data={data} theme={theme} expandLevel={3}/>
                    </div>
                </TabCase>
            </Tabs></>
        }

        <FormDrawer
            width={800}
            onClose={() => {
                setEditData(null)
            }}
            open={editData !== null}
        >
            <EventSourceForm value={editData}
                             style={{margin: 20}}
                             onClose={() => {
                                 setEditData(null);
                                 setRefresh(refresh + 1)
                             }}
            />
        </FormDrawer>
    </>

}

EventSourceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};