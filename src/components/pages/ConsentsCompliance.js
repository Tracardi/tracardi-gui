import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import SquareCard from "../elements/lists/cards/SquareCard";
import {VscLaw} from "react-icons/vsc";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {asyncRemote} from "../../remote_api/entrypoint";
import {useConfirm} from "material-ui-confirm";
import DataComplianceForm from "../elements/forms/DataComplianceForm";
import DataComplianceDetails from "../elements/details/DataComplianceDetails";


export default function  ConsentsDataCompliance() {

    const urlFunc= useCallback((query) => ('/consent/compliance/fields' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <DataComplianceForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <DataComplianceDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this data compliance enforcement?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/consent/compliance/field/' + id,
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
                                           icon={<VscLaw size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           onClick={() => onClick(row?.id)}
                        />
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
                                           data={{...row, icon: "consent"}}
                                           onClick={onClick}
                                           status={row?.enabled}
                                           onDelete={handleDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Data compliance with customer consents"
        description="Data compliance refers to the practice of adhering to laws, regulations, and guidelines related
        to the handling, processing, and storing of data. This is the list of defined field level data compliances
        with customer consents."
        urlFunc={urlFunc}
        cardFunc={cards}
        rowFunc={rows}
        buttonLabel="New compliance"
        buttonIcon={<VscLaw size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New compliance"
        drawerAddWidth={1500}
        addFunc={addFunc}
    />
}
