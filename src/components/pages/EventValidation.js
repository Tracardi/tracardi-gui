import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import EventValidationDetails from "../elements/details/EventValidationDetails";
import EventValidationForm from "../elements/forms/EventValidationForm";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";

export default function EventValidation() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/event-validator/list' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <EventValidationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <EventValidationDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this validation?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/event-validator/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh + 1)
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
                                           data={{...row, icon: "validator"}}
                                           onDelete={handleDelete}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="event_validation"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event validation"
        description="Event validation allows the check of event payload before it reaches the database and workflow.
        Event validation is available in commercial version of Tracardi."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New validation"
        buttonIcon={<FlowNodeIcons icon="validator"/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New validation"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
