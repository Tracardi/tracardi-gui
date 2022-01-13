import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import SegmentForm from "../elements/forms/SegmentForm";
import SegmentDetails from "../elements/details/SegmentDetails";

export default function Segments() {

    const urlFunc = useCallback((query) => ('/segments' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <SegmentForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <SegmentDetails id={id} onDeleteComplete={close}/>, []);

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
        label="Segments"
        urlFunc={urlFunc}
        cardFunc={segments}
        buttomLabel="New segment"
        buttonIcon={<VscOrganization size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Source details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New segment"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
