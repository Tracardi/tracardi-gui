import React, {useCallback} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import CardBrowser from "../elements/lists/CardBrowser";
import ResourceForm from "../elements/forms/ResourceForm";
import {AiOutlineCloudServer} from "react-icons/ai";
import BrowserRow from "../elements/lists/rows/BrowserRow";


export default function Resources({defaultLayout = "rows"}) {

    const urlFunc = useCallback((query) => ('/resources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ResourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);


    const sourceRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           status={row?.enabled}
                                           onClick={onClick}
                                           deplomentTable="resource"
                                           deleteEndpoint='/resource/'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Resources"
        defaultLayout={defaultLayout}
        urlFunc={urlFunc}
        rowFunc={sourceRows}
        buttonLabel="New resource"
        buttonIcon={<AiOutlineCloudServer size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
