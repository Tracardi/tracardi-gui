import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "@react-icons/all-files/vsc/VscOrganization";
import SegmentForm from "../elements/forms/SegmentForm";
import SegmentDetails from "../elements/details/SegmentDetails";

export default function Segments() {

    const segments = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscOrganization size={45}/>}
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
            urlFunc={(query) => ('/segments' + ((query) ? "?query=" + query : ""))}
            cardFunc={segments}
            buttomLabel="New segment"
            buttonIcon={<VscOrganization size={20} style={{marginRight: 10}}/>}
            drawerDetailsTitle="Source details"
            drawerDetailsWidth={800}
            detailsFunc={(id, close) => <SegmentDetails id={id} onDeleteComplete={close}/>}
            drawerAddTitle="New segment"
            drawerAddWidth={800}
            addFunc={(close) => <SegmentForm onSubmit={close}/>}
            className="Pad10"
        />

}
