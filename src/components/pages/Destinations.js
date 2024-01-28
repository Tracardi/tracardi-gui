import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsBoxArrowRight} from "react-icons/bs";
import DestinationForm from "../elements/forms/DestinationForm";
import DestinationDetails from "../elements/details/DestinationDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function Destinations() {

    const urlFunc = useCallback((query) => ('/destinations/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <DestinationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <DestinationDetails id={id} onDelete={close} onEdit={close}/>, []);

    const rows = (data, onClick) => {
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
                                           deplomentTable="destination"
                                           deleteEndpoint='/destination/'
                                           icon={}"destination"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Profile Destinations"
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New destination"
        buttonIcon={<BsBoxArrowRight size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New Destination"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
