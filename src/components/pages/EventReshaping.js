import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventReshapingDetails from "../elements/details/EventReshapingDetails";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventReshapingForm from "../elements/forms/EventReshapingForm";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";

export default function EventReshaping() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/event-reshape-schema' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventReshapingForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventReshapingDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event reshaping?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/event-reshape-schema/' + id,
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
                                           icon={<FlowNodeIcons icon="map-properties" size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
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
                                           data={{...row, icon: "map-properties"}}
                                           onDelete={handleDelete}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event reshaping"
        description="Event reshaping allows the change of event payload before it reaches the database and workflow."
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttomLabel="New reshape"
        buttonIcon={<FlowNodeIcons icon="map-properties"/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New reshape"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
