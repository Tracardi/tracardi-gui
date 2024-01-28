import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import IdentificationPointForm from "../elements/forms/IdentifiactionPointForm";
import IdentificationPointDetails from "../elements/details/IdentificationPointDetails";

export default function IdentificationPoint() {

    const urlFunc = useCallback((query) => ('/identification/points' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <IdentificationPointForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <IdentificationPointDetails id={id} onDeleteComplete={close}/>, []);

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, }}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           deplomentTable="identification_point"
                                           deleteEndpoint='/identification/point/'
                                           icon="identity"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Identification point"
        description="Identification point is an event in the customer journey that allows you to identify customer. "
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New identification"
        buttonIcon={<FlowNodeIcons icon="identity"/>}
        drawerDetailsWidth={850}
        detailsFunc={detailsFunc}
        drawerAddTitle="New identification"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
