import React, {useCallback, useState} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import CardBrowser from "../elements/lists/CardBrowser";
import ResourceForm from "../elements/forms/ResourceForm";
import {AiOutlineCloudServer} from "react-icons/ai";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";


export default function Resources({defaultLayout="rows"}) {

    const urlFunc = useCallback((query) => ('/resources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ResourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this resource?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/resource/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const sourceRows = (data, onClick) => {
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
                                           onDelete={handleDelete}
                                           deplomentTable="resource"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Resources"
        defaultLayout={defaultLayout}
        urlFunc={urlFunc}
        rowFunc={sourceRows}
        buttonLabel="New resource"
        buttonIcon={<AiOutlineCloudServer size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
        refresh={refresh}
    />
}
