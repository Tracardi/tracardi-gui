import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {VscCopy} from "react-icons/vsc";
import EventToProfileForm from "../elements/forms/EventToProfileForm";
import EventToProfileDetails from "../elements/details/EventToProfileDetails";
import {useRequest} from "../../remote_api/requestClient";

export default function EventToProfile() {

    const [refresh, setRefresh] = useState(0);
    const {request} = useRequest()

    const urlFunc = useCallback((query) => ('/events-to-profiles/by_tag' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventToProfileForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EventToProfileDetails id={id} onDeleteComplete={close}
                                                                         onEditComplete={close}/>, [])

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({
            title: "Do you want to delete this event to profile copying schema?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    try {
                        await request({
                            url: '/event-to-profile/' + id,
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
                                           data={{...row, icon: "copy"}}
                                           tags={row.tags}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           deplomentTable="event_to_profile_mapping"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Map event properties to profile"
        description="List of schemas that define how you transfer information from events to your profile."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New mapping"
        buttonIcon={<VscCopy size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New mapping"
        drawerAddWidth={950}
        addFunc={addFunc}
    />
}
