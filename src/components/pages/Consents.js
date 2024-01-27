import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscLaw} from "react-icons/vsc";
import ConsentDetails from "../elements/details/ConsentDetails";
import ConsentForm from "../elements/forms/ConsentForm";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";


export default function  Consents() {

    const urlFunc= useCallback((query) => ('/consents/types' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <ConsentForm onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <ConsentDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, [])
    const [refresh, setRefresh] = useState(0);
    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this consent?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/consent/type/' + id,
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
                                           data={{...row, icon: "consent"}}
                                           onClick={onClick}
                                           status={row?.enabled}
                                           onDelete={handleDelete}
                                           deplomentTable="consent_type"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="row"
        label="Consent types"
        description="User consent refers to the process of obtaining permission from an individual to collect, use, or
        share their personal data. This is the list of defined consent types that you may require from your customers.
        You may filter this list by consent name in the upper search box."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New consent type"
        buttonIcon={<VscLaw size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New consent type"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
