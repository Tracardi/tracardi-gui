import React, {useContext, useState} from "react";
import "./DataAnalytics.css";
import DataAnalytics, {LocalDataContext} from "./DataAnalytics";
import {EventRow} from "../elements/lists/rows/EventRow";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import EventToProfileCopy from "../elements/forms/EventToProfileCopy";
import Button from "../elements/forms/Button";
import RemoteService from "../../remote_api/endpoints/raw";
import {
    getEventsIndexingCopy,
    getEventsToProfileCopy,
    getEventsTotalRecords
} from "../../remote_api/endpoints/event";
import FetchError from "../errors/FetchError";
import {BsDatabaseFillGear} from "react-icons/bs";
import NoData from "../elements/misc/NoData";
import Tag from "../elements/misc/Tag";
import PropertyField from "../elements/details/PropertyField";
import {useFetch} from "../../remote_api/remoteState";
import EventIndexMap from "../elements/forms/EventIndexMap";

function CopyToProfileExtension({onClose}) {

    const localContext = useContext(LocalDataContext)
    const query = localStorage.getItem('eventQuery')
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [settings, setSetting] = useState({
        query,
        mappings: []
    })

    const {isLoading, data: count} = useFetch(
        ["countAffectedRecords"],
        getEventsTotalRecords(query),
        data=>data
    )

    const handleRun = async () => {
        try {
            setSuccess(false)
            setError(null)
            let endpoint = getEventsToProfileCopy(settings)
            endpoint.headers = {
                'x-context': localContext === true ? 'production': 'staging'
            }
            const response = await RemoteService.fetch(endpoint)
            setSuccess(true)
        } catch (e) {
            setError(e)
        }
    }

    if (success) {
        return <NoData
            style={{margin:30}}
            icon={<BsDatabaseFillGear size={60}/>}
            header="Task started"
        >
            <p style={{color: "#555"}}>The process of copying your data has started, and a background task is currently running to transfer the data.</p>
            <Button label="OK" onClick={onClose} style={{margin: 20}}/>
        </NoData>
    }

    return <div style={{padding: 20}}>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Used event dataset"
                    description="The data will be narrowed down by the query defined in the search box. More details are provided below."
                />
                <TuiFormGroupContent>
                    <PropertyField name="Environment" content={localContext ? <Tag backgroundColor="rgb(173, 20, 87)" color="white">production</Tag> : "Test"}/>
                    <PropertyField name="Used filter" content={query}/>
                    <PropertyField name="Total records" content={isLoading ? "counting..." : count } underline={false}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Assign data to profile from event. "
                                    description="What data should be copied to profile."
                />
                <TuiFormGroupContent>
                    <EventToProfileCopy onChange={(v) => {
                        setSetting({...settings, mappings: v})
                    }}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <div style={{marginBottom: 10}}>
            <Button label="Run in background" onClick={handleRun}/>
        </div>
        {error && <FetchError error={error} />}
    </div>
}

function IndexEventPropertiesExtension({onClose}) {

    const localContext = useContext(LocalDataContext)
    const query = localStorage.getItem('eventQuery')
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [settings, setSetting] = useState({
        query,
        mappings: []
    })

    const {isLoading, data: count} = useFetch(
        ["countAffectedRecords"],
        getEventsTotalRecords(query),
        data=>data
    )

    const handleRun = async () => {
        try {
            setSuccess(false)
            setError(null)
            let endpoint = getEventsIndexingCopy(settings)
            endpoint.headers = {
                'x-context': localContext === true ? 'production': 'staging'
            }
            const response = await RemoteService.fetch(endpoint)
            setSuccess(true)
        } catch (e) {
            setError(e)
        }
    }

    if (success) {
        return <NoData
            style={{margin:30}}
            icon={<BsDatabaseFillGear size={60}/>}
            header="Task started"
        >
            <p style={{color: "#555"}}>The process of event indexing has started, and a background task is currently running to transfer the data.</p>
            <Button label="OK" onClick={onClose} style={{margin: 20}}/>
        </NoData>
    }

    return <div style={{padding: 20}}>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader
                    header="Used event dataset"
                    description="The data will be narrowed down by the query defined in the search box. Only the filtered events will be affected. More details are provided below."
                />
                <TuiFormGroupContent>
                    <PropertyField name="Environment" content={localContext ? <Tag backgroundColor="rgb(173, 20, 87)" color="white">production</Tag> : "Test"}/>
                    <PropertyField name="Used filter" content={query}/>
                    <PropertyField name="Total records" content={isLoading ? "counting..." : count } underline={false}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Index event properties. "
                                    description="Which properties should be indexed?"
                />
                <TuiFormGroupContent>
                    <EventIndexMap onChange={(v) => {
                        setSetting({...settings, mappings: v})
                    }}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <div style={{marginBottom: 10}}>
            <Button label="Run in background" onClick={handleRun}/>
        </div>
        {error && <FetchError error={error} />}
    </div>
}

export default function EventsAnalytics({displayChart = true}) {

    const handleLoadDataRequest = (query) => {
        return {
            url: '/event/select/range',
            method: "post",
            data: query,
            limit: 30,
            page: 0
        }
    }

    const handleLoadHistogramRequest = (query) => {
        return {
            url: '/event/select/histogram?group_by=metadata.status',
            method: "post",
            data: query,
            limit: 30,
            page: 0
        }
    }

    const handleLoadDetails = (id) => {
        return {
            url: "/event/" + id, method: "get"
        }
    }

    return <><DataAnalytics
        type="event"
        label="List of events"
        enableFiltering={true}
        timeFieldLabel="timestamp"
        filterFields={[
            'session.profile',
            'session.context',
            'session.operation',
            'context.config',
            'profile.operation',
            'profile.metadata',
            'profile.pii',
            'profile.stats',
            'profile.traits',
            'profile.segments',
            'metadata',
            'context'
        ]}
        rowDetails={(row, filterFields) => {
            return <EventRow row={row} filterFields={filterFields}/>
        }}
        onLoadHistogramRequest={handleLoadHistogramRequest}
        onLoadDataRequest={handleLoadDataRequest}
        onLoadDetails={handleLoadDetails}
        detailsDrawerWidth={1050}
        displayChart={displayChart}
        barChartColors={{processed: "#00C49F", error: "#d81b60", collected: '#0088FE'}}
        ExtensionDropDown={{
            'Copy event data to profile': CopyToProfileExtension,
            'Index event properties': IndexEventPropertiesExtension
        }}
    />
    </>


}