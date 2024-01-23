import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsBoxArrowRight} from "react-icons/bs";
import DestinationForm from "../elements/forms/DestinationForm";
import DestinationDetails from "../elements/details/DestinationDetails";
import {useConfirm} from "material-ui-confirm";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useRequest} from "../../remote_api/requestClient";

export default function Destinations() {

    const urlFunc = useCallback((query) => ('/destinations/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <DestinationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <DestinationDetails id={id} onDelete={close} onEdit={close}/>, []);
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this destination?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/destination/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "destination"}}
                                           status={row?.enabled}
                                           onClick={onClick}
                                           onDelete={handleDelete}
                                           deplomentTable="destination"
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
