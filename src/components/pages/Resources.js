import React, {useCallback} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import ResourceForm from "../elements/forms/ResourceForm";
import {AiOutlineCloudServer} from "react-icons/ai";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import BrowserRow from "../elements/lists/rows/BrowserRow";


export default function Resources({defaultLayout="cards"}) {

    const urlFunc = useCallback((query) => ('/resources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ResourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);

    const sourceCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon={row?.icon} size={45} defaultIcon="resource"/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const sourceRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Resources"
        defaultLayout={defaultLayout}
        urlFunc={urlFunc}
        cardFunc={sourceCards}
        rowFunc={sourceRows}
        buttomLabel="New resource"
        buttonIcon={<AiOutlineCloudServer size={20}/>}
        drawerDetailsTitle="Resource details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
