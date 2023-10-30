import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import {useConfirm} from "material-ui-confirm";
import IdentificationPointForm from "../elements/forms/IdentifiactionPointForm";
import IdentificationPointDetails from "../elements/details/IdentificationPointDetails";
import {useRequest} from "../../remote_api/requestClient";

export default function IdentificationPoint() {

    const [refresh, setRefresh] = useState(0);
    const {request} = useRequest()

    const urlFunc = useCallback((query) => ('/identification/points' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <IdentificationPointForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <IdentificationPointDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this identification point?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/identification/point/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const cards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon="identity" size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "identity"}}
                                           onDelete={handleDelete}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Identification point"
        description="Identification point is an event in the customer journey that allows you to identify customer. "
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttonLabel="New identification"
        buttonIcon={<FlowNodeIcons icon="identity"/>}
        drawerDetailsWidth={850}
        detailsFunc={detailsFunc}
        drawerAddTitle="New identification"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
