import React, {useCallback} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {VscCopy} from "react-icons/vsc";
import EventToProfileForm from "../elements/forms/EventToProfileForm";
import EventToProfileDetails from "../elements/details/EventToProfileDetails";

export default function EventToProfile() {

    const urlFunc = useCallback((query) => ('/events-to-profiles/by_tag' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <EventToProfileForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EventToProfileDetails id={id} onDeleteComplete={close}
                                                                         onEditComplete={close}/>, [])

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "copy"}}
                                           tags={row.tags}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="event_to_profile_mapping"
                                           deleteEndpoint='/event-to-profile/'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Map event properties to profile"
        description="List of schemas that define how you transfer information from events to your profile."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New mapping"
        buttonIcon={<VscCopy size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New mapping"
        drawerAddWidth={950}
        addFunc={addFunc}
    />
}
