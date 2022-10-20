import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import LiveSegmentDetails from "../elements/details/LiveSegmentDetails";
import LiveSegmentForm from "../elements/forms/LiveSegmentForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function LiveSegments() {

    const urlFunc = useCallback((query) => ('/segments/live' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <LiveSegmentForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <LiveSegmentDetails id={id} onDeleteComplete={close}/>, []);

    const liveSegmentsCards = (data, onClick) => {
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

    const liveSegmentsRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "segment"}}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Live Segments"
        description="Live Segmentation is triggered periodically to keep the profile up-to-date with segmentation logic."
        urlFunc={urlFunc}
        cardFunc={liveSegmentsCards}
        rowFunc={liveSegmentsRows}
        buttomLabel="New live segment"
        buttonIcon={<VscOrganization size={20}/>}
        drawerDetailsTitle="Live segment details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New live segment"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
