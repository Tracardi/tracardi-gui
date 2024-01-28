import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {BsPerson} from "react-icons/bs";
import EditUserForm from "../elements/forms/EditUserForm";
import NewUserForm from "../elements/forms/NewUserForm";


export default function Reports() {

    const urlFunc = useCallback((query) => ('/users' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <NewUserForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EditUserForm id={id} onSubmit={close}/>, [])

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, name: row.full_name}}
                                           onClick={() => onClick(row?.id)}
                                           status={row.enabled}
                                           icon="profile"
                                           deleteEndpoint='/user/'
                                           forceMode='no-deployment'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Users"
        description="ist of users registered in the system."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New user"
        buttonIcon={<BsPerson size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New user"
        drawerAddWidth={600}
        addFunc={addFunc}
        defaultLayout="rows"
    />
}
