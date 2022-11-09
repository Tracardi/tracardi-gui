import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import {BsBoxArrowInRight} from "react-icons/bs";
import EventSourceForm from "../elements/forms/EventSourceForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";


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
                                           onClick={() => onClick(row?.id)}
                                           tags={[row.type]}
                        />
                    })}
                </div>
            </div>
        })
    }

    const sourcesRows = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            icon: "source",
                            enabled: row?.enabled,
                            name: row?.name,
                            description: row?.description
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           onClick={() => onClick(row?.id)}
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
        cardFunc={sources}
        buttomLabel="New event source"
        buttonIcon={<BsBoxArrowInRight size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event source"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
