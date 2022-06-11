import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import EventManagementForm from "../elements/forms/EventManagementForm";
import {BsFolderCheck} from "react-icons/bs";
import EventManagementDetails from "../elements/details/EventManagementDetails";

export default function EventManagement() {

    const urlFunc= useCallback((query) => ('/event-type/management/search/by_tag'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventManagementForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventManagementDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])

    const flows = (data, onClick) => {
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

    return <CardBrowser
        label="Event type Prerequisites and Meta-data"
        description="List of event types."
        urlFunc={urlFunc}
        cardFunc={flows}
        buttomLabel="New event type"
        buttonIcon={<BsFolderCheck size={20}/>}
        drawerDetailsTitle="Event type details"
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event type"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
