import React, {useContext} from "react";
import "./DataAnalytics.css";
import DataAnalytics, {LocalDataContext} from "./DataAnalytics";
import {EventRow} from "../elements/lists/rows/EventRow";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import EventToProfileCopy from "../elements/forms/EventToProfileCopy";
import Button from "../elements/forms/Button";

function CopyToProfileExtension() {

    const localContext = useContext(LocalDataContext)

    const query = localStorage.getItem('eventQuery')
    return <div style={{padding: 20}}><TuiForm >
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Data filtered by query"
                description="Data will be narrowed down by the query. "
            />
            <TuiFormGroupContent>
                {query} {localContext ? "On production" : "On test environment"}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Assign data to profile from event. "
            description="What data should be copied to profile."
            />
            <TuiFormGroupContent>
                <EventToProfileCopy onChange={(v) => console.log(v)}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
        <div>
            <Button label="Run in background" />
        </div>
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
            'Copy data to profile': CopyToProfileExtension
        }}
    />
</>


}