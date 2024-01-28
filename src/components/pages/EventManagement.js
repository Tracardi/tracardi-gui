import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import EventMappingForm from "../elements/forms/EventMappingForm";
import {BsFolderCheck} from "react-icons/bs";
import EventMappingDetails from "../elements/details/EventMappingDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventJourneyTag from "../elements/misc/EventJourneyTag";

export default function EventManagement() {

    const urlFunc= useCallback((query) => ('/event-type/search/mappings'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventMappingForm onSubmit={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventMappingDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           tags={row.tags}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="event_mapping"
                                           deleteEndpoint="/event-type/mapping/"
                                           icon="validator"
                        >
                            {row.journey && <EventJourneyTag>{row.journey}
                            </EventJourneyTag>} {row.description && <span style={{marginRight: 5}}>{row.description}</span>}
                        </BrowserRow>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event mapping and event metadata"
        description="List of event types."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New mapping"
        buttonIcon={<BsFolderCheck size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New mapping"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
