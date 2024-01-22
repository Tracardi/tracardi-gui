import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import LiveSegmentDetails from "../elements/details/LiveSegmentDetails";
import SegmentationJobForm from "../elements/forms/SegmentationJobForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";

export default function LiveSegments() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/segments/live' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <SegmentationJobForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <LiveSegmentDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this segmentation?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/segment/live/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

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
                                           data={{...row, icon: "segment"}}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           deplomentTable="workflow_segment"
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
