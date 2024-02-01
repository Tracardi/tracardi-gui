import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {BsFileEarmarkArrowUp} from "react-icons/bs";
import ImportDetails from "../elements/details/ImportDetails";
import ImportForm from "../elements/forms/ImportForm";

export default function ImportSources () {

    const urlFunc = useCallback((query) => ('/imports' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <ImportForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <ImportDetails id={id} onClose={close}/>, []);

    return <CardBrowser
        label="Import sources"
        description="List of configured import sources."
        urlFunc={urlFunc}
        buttonLabel="New import"
        buttonIcon={<BsFileEarmarkArrowUp size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New import"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
        forceMode='no-deployment'
        deleteEndpoint='/import/'
    />
}