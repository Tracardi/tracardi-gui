import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventReshapingDetails from "../elements/details/EventReshapingDetails";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventReshapingForm from "../elements/forms/EventReshapingForm";

export default function EventReshaping() {

    const urlFunc = useCallback((query) => ('/event-reshape-schema' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventReshapingForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventReshapingDetails id={id} onDeleteComplete={close}/>, []);


    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="event_reshaping"
                                           deleteEndpoint='/event-reshape-schema/'
                                           icon ="map-properties"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event reshaping"
        description="Event reshaping allows the change of event payload before it reaches the database and workflow.
        Event reshaping is available in commercial version of Tracardi."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New reshape"
        buttonIcon={<FlowNodeIcons icon="map-properties"/>}
        drawerDetailsWidth={850}
        detailsFunc={detailsFunc}
        drawerAddTitle="New reshape"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
