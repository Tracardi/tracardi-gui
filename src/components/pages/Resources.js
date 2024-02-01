import React, {useCallback} from "react";
import ResourceDetails from "../elements/details/ResourceDetails";
import CardBrowser from "../elements/lists/CardBrowser";
import ResourceForm from "../elements/forms/ResourceForm";
import {AiOutlineCloudServer} from "react-icons/ai";


export default function Resources({defaultLayout = "rows"}) {

    const urlFunc = useCallback((query) => ('/resources/by_type' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ResourceForm onClose={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ResourceDetails id={id} onDeleteComplete={close}/>, []);

    return <CardBrowser
        label="Resources"
        defaultLayout={defaultLayout}
        urlFunc={urlFunc}
        buttonLabel="New resource"
        buttonIcon={<AiOutlineCloudServer size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New resource"
        drawerAddWidth={800}
        addFunc={addFunc}
        deploymentTable="resource"
        deleteEndpoint='/resource/'
    />
}
