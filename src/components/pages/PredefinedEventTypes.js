import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscSymbolEvent} from "react-icons/vsc";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import BuildInEventTypeDetail from "../elements/details/BuildInEventTypeDetail";


export default function BuildInEventTypes() {

    const urlFunc = useCallback((query) => ('/event-types/build-in/by_type' + ((query) ? "?query=" + query : "")), []);
    const detailsFunc = useCallback((id, close) => <BuildInEventTypeDetail id={id}/>, []);

    const eventTypesCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscSymbolEvent size={45}/>}
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

    const eventTypesRows = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            name: row?.name,
                            description: row?.description
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           status={row?.enabled}
                                           lock={row?.locked}
                                           onClick={() => onClick(row?.id)}
                                           forceMode="none"
                                           icon="event"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Build-in Event Types"
        urlFunc={urlFunc}
        rowFunc={eventTypesRows}
        cardFunc={eventTypesCards}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddWidth={800}
    />
}
