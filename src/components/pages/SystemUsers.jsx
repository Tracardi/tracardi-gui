import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsPerson} from "react-icons/bs";
import EditUserForm from "../elements/forms/EditUserForm";
import NewUserForm from "../elements/forms/NewUserForm";


export default function SystemUsers() {

    const urlFunc = useCallback((query) => ('/users' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <NewUserForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EditUserForm id={id} onSubmit={close}/>, [])

    return <CardBrowser
        label="Users"
        description="List of users registered in the system."
        urlFunc={urlFunc}
        buttonLabel="New user"
        buttonIcon={<BsPerson size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New user"
        drawerAddWidth={600}
        addFunc={addFunc}
        defaultLayout="rows"
        icon="profile"
        deleteEndpoint='/user/'
        forceMode='no-deployment'
    />
}
