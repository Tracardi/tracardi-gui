import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsBoxArrowRight} from "react-icons/bs";
import DestinationForm from "../elements/forms/DestinationForm";
import DestinationDetails from "../elements/details/DestinationDetails";

export default function Destinations() {

    const urlFunc = useCallback((query) => ('/destinations/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <DestinationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <DestinationDetails id={id} onDelete={close} onEdit={close}/>, []);

    const destinations = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<BsBoxArrowRight size={45}/>}
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
        label="Profile Destinations"
        urlFunc={urlFunc}
        cardFunc={destinations}
        buttomLabel="New destination"
        buttonIcon={<BsBoxArrowRight size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Destination details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New Destination"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
