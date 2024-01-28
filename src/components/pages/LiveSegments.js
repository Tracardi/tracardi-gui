import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import LiveSegmentDetails from "../elements/details/LiveSegmentDetails";
import SegmentationJobForm from "../elements/forms/SegmentationJobForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function LiveSegments() {

    const urlFunc = useCallback((query) => ('/segments/live' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <SegmentationJobForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <LiveSegmentDetails id={id} onDeleteComplete={close}/>, []);

    const segmentsRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           tags={[row.type]}
                                           status={row.enabled}
                                           data={{...row}}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="workflow_segment"
                                           deleteEndpoint='/segment/live/'
                                           icon="segment"
                        >{row.description}</BrowserRow>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Segmentation"
        description="Segmentation is a scheduled task that updates the profile regularly by following defined segmentation rules.
        To make this happen, a separate worker process for segmentation needs to run in the background."
        urlFunc={urlFunc}
        defaultLayout="rows"
        rowFunc={segmentsRows}
        buttonLabel="New segmentation"
        buttonIcon={<VscOrganization size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New segmentation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
