import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscOrganization} from "react-icons/vsc";
import SegmentForm from "../elements/forms/SegmentForm";
import SegmentDetails from "../elements/details/SegmentDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";

export default function Segments() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/segments' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <SegmentForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <SegmentDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this segmentation?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/segment/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const segmentsCards = (data, onClick) => {
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

    const segmentsRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           status={row?.enabled}
                                           data={{...row, icon: "segment"}}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Segments"
        description="Segmentation is triggered every time the profile is updated. It evalutes the segment condition and
        if it is met then the profile is assigned to defined segment. Segments can be added dynamically inside the workflow."
        urlFunc={urlFunc}
        defaultLayout="rows"
        cardFunc={segmentsCards}
        rowFunc={segmentsRows}
        buttonLabel="New segment"
        buttonIcon={<VscOrganization size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New segment"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
