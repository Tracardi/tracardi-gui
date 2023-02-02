import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsBoxArrowRight} from "react-icons/bs";
import DestinationForm from "../elements/forms/DestinationForm";
import DestinationDetails from "../elements/details/DestinationDetails";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function Destinations() {

    const urlFunc = useCallback((query) => ('/destinations/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <DestinationForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <DestinationDetails id={id} onDelete={close} onEdit={close}/>, []);
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this destination?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/destination/' + id,
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
                                           icon={<BsBoxArrowRight size={45}/>}
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
        cardFunc={cards}
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
