import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import EventMetadataForm from "../elements/forms/EventMetadataForm";
import {BsFolderCheck} from "react-icons/bs";
import EventMataDataDetails from "../elements/details/EventMataDataDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function EventManagement() {

    const urlFunc= useCallback((query) => ('/event-type/management/search/by_tag'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventMetadataForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventMataDataDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

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
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event type Prerequisites and Meta-data"
        description="List of event types."
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttonLabel="New event type"
        buttonIcon={<BsFolderCheck size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event type"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
