import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "@react-icons/all-files/vsc/VscOrganization";
import SegmentForm from "../elements/forms/SegmentForm";
import SegmentDetails from "../elements/details/SegmentDetails";


export default function Segments() {

    const segments = (data, onClick) => {
        return data?.result && data?.result.map((row, index) => {
            return <SquareCard key={index}
                               id={row?.id}
                               icon={<VscOrganization size={45}/>}
                               status={row?.enabled}
                               name={row?.name}
                               description={row?.description}
                               onClick={() => onClick(row?.id)}/>
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
