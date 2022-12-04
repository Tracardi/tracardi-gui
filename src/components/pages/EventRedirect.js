import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import {IoArrowRedoOutline} from "react-icons/io5";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventRedirectForm from "../elements/forms/EventRedirectForm";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";
import EventRedirectDetails from "../elements/details/EventRedirectDetails";

export default function EventRedirect() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc= useCallback((query) => ('/event-redirects'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventRedirectForm
        onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventRedirectDetails
        id={id}
        onDeleteComplete={close}
        onEditComplete={close}/>, [])
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event redirect?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/event-redirect/' + id,
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
                                           icon={<IoArrowRedoOutline size={45}/>}
                                           tags={[(row.enabled && "Validated")]}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}
                        />
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
                                           data={{...row, icon: "redirect"}}
                                           tags={row.tags}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event redirects"
        description="List of event redirects."
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttonLabel="New event redirect"
        buttonIcon={<IoArrowRedoOutline size={20}/>}
        drawerDetailsWidth={700}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event redirect"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
