import React, {useCallback, useState} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import EventSourceDetails from "../elements/details/EventSourceDetails";
import {BsBoxArrowInRight} from "react-icons/bs";
import EventSourceForm from "../elements/forms/EventSourceForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";


export default function EventSources() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/event-sources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventSourceForm onClose={close} style={{margin: 20}}/>, []);
    const detailsFunc = useCallback((id, close) => <EventSourceDetails id={id} onDeleteComplete={close}/>, []);

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event source?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/event-source/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const handleDeploy = async (id, deploy) => {
        try {
            await request({
                url: deploy ? `/deploy/event_source/${id}` : `/undeploy/event_source/${id}`,
                method: "get"
            })
        } catch (e) {
            console.error(e)
        }
    }

    const sourcesRows = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            icon: "source",
                            enabled: row?.enabled,
                            name: row?.name,
                            description: row?.description,
                            production: row.production,
                            running: row.running
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           status={row?.enabled}
                                           lock={row?.locked}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           deplomentTable='event_source'
                                           tags={[row.type]}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Event Sources"
        description="Event source opens an API through which you will be able to send data. Click on event source to
        see the Javascript snippet or API URL that you can use to collect data."
        urlFunc={urlFunc}
        rowFunc={sourcesRows}
        // cardFunc={sources}
        buttonLabel="New event source"
        buttonIcon={<BsBoxArrowInRight size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event source"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
