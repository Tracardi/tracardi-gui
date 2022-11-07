import React, {useCallback, useState} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import ResourceForm from "../elements/forms/ResourceForm";
import {AiOutlineCloudServer} from "react-icons/ai";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {asyncRemote} from "../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";


export default function Resources({defaultLayout="rows"}) {

    const urlFunc = useCallback((query) => ('/resources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ResourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();

    const onDelete = async (id) => {
        confirm({title: "Do you want to delete this resource?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/resource/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const sourceCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon={row?.icon} size={45} defaultIcon="resource"/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
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
                                           onClick={onClick}
                                           onDelete={onDelete}
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
        cardFunc={sourceCards}
        rowFunc={sourceRows}
        buttomLabel="New resource"
        buttonIcon={<AiOutlineCloudServer size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
        refresh={refresh}
    />
}
