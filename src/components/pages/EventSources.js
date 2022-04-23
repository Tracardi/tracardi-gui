import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import {BsBoxArrowInRight} from "react-icons/bs";
import EventSourceForm from "../elements/forms/EventSourceForm";


export default function EventSources() {

    const urlFunc = useCallback((query) => ('/event-sources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventSourceForm onClose={close} style={{margin: 20}}/>, []);
    const detailsFunc = useCallback((id, close) => <EventSourceDetails id={id} onDeleteComplete={close}/>, []);

    const sources = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsBoxArrowInRight size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Event Sources"
        urlFunc={urlFunc}
        cardFunc={sources}
        buttomLabel="New event source"
        buttonIcon={<BsBoxArrowInRight size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Event source details"
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event source"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
