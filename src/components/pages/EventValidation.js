import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventValidationDetails from "../elements/details/EventValidationDetails";
import EventValidationForm from "../elements/forms/EventValidationForm";

export default function EventValidation() {

    const urlFunc = useCallback((query) => ('/event-validator/list' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventValidationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventValidationDetails id={id} onDeleteComplete={close}/>, []);


    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="event_validation"
                                           icon="validator"
                                           deleteEndpoint='/event-validator/'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event validation"
        description="Event validation allows the check of event payload before it reaches the database and workflow.
        Event validation is available in commercial version of Tracardi."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New validation"
        buttonIcon={<FlowNodeIcons icon="validator"/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New validation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
