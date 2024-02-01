import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BuildInEventTypeDetail from "../elements/details/BuildInEventTypeDetail";


export default function BuildInEventTypes() {

    const urlFunc = useCallback((query) => ('/event-types/build-in/by_type' + ((query) ? "?query=" + query : "")), []);
    const detailsFunc = useCallback((id, close) => <BuildInEventTypeDetail id={id}/>, []);

    return <CardBrowser
        label="Build-in Event Types"
        urlFunc={urlFunc}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddWidth={800}
        forceMode="none"
        icon="event"
    />
}
