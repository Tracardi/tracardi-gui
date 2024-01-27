import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {IoArrowRedoOutline} from "react-icons/io5";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventRedirectForm from "../elements/forms/EventRedirectForm";
import EventRedirectDetails from "../elements/details/EventRedirectDetails";

export default function EventRedirect() {

    const urlFunc = useCallback((query) => ('/event-redirects' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventRedirectForm
        onSaveComplete={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EventRedirectDetails
        id={id}
        onDeleteComplete={close}
        onEditComplete={close}/>, [])

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           icon="redirect"
                                           tags={row.tags}
                                           onClick={() => onClick(row?.id)}
                                           deleteEndpoint='/event-redirect/'
                                           deplomentTable='event_redirect'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event redirects"
        description="List of event redirects."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New event redirect"
        buttonIcon={<IoArrowRedoOutline size={20}/>}
        drawerDetailsWidth={700}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event redirect"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
