import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import {BsBoxArrowInRight} from "react-icons/bs";
import EventSourceForm from "../elements/forms/EventSourceForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";


export default function EventSources() {

    const urlFunc = useCallback((query) => ('/event-sources' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventSourceForm onClose={close} style={{margin: 20}}/>, []);
    const detailsFunc = useCallback((id, close) => <EventSourceDetails id={id} onDeleteComplete={close}/>, []);

    const sourcesRows = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            enabled: row?.enabled,
                            name: row?.name,
                            description: row?.description,
                            production: row.production,
                            running: row.running
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           status={row?.enabled}
                                           lock={row?.locked}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable='event_source'
                                           deleteEndpoint='/event-source/'
                                           icon="source"
                                           tags={[row.type]}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Event Sources"
        description="Event source opens an API through which you will be able to send data. Click on event source to
        see the Javascript snippet or API URL that you can use to collect data."
        urlFunc={urlFunc}
        rowFunc={sourcesRows}
        buttonLabel="New event source"
        buttonIcon={<BsBoxArrowInRight size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event source"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
