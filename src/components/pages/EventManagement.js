import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import EventMappingForm from "../elements/forms/EventMappingForm";
import {BsFolderCheck} from "react-icons/bs";
import EventMappingDetails from "../elements/details/EventMappingDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import EventJourneyTag from "../elements/misc/EventJourneyTag";
import {useRequest} from "../../remote_api/requestClient";

export default function EventManagement() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc= useCallback((query) => ('/event-type/search/mappings'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventMappingForm onSubmit={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventMappingDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event mapping?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/event-type/mapping/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "validator"}}
                                           tags={row.tags}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           deplomentTable="event_mapping"
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
