import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import EventIndexingForm from "../elements/forms/EventIndexingForm";
import {BsFolderCheck} from "react-icons/bs";
import EventMappingDetails from "../elements/details/EventMappingDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";

export default function EventManagement() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc= useCallback((query) => ('/event-type/search/mappings'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventIndexingForm onSubmit={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventMappingDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event mapping?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/event-type/mapping/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const cards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsFolderCheck size={45}/>}
                                           tags={[(row.enabled && "Validated")]}
                                           name={row?.name}
                                           status={row?.enabled}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}
                        />
                    })}
                </div>
            </div>
        })
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
                        />
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
        cardFunc={cards}
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
