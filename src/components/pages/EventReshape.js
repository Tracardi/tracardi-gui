import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventReshapingDetails from "../elements/details/EventReshapingDetails";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventReshapingForm from "../elements/forms/EventReshapingForm";

export default function EventReshape() {

    const urlFunc = useCallback((query) => ('/event-reshape-schema' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventReshapingForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventReshapingDetails id={id} onDeleteComplete={close}/>, []);

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
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
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
