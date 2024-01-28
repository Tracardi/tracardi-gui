import React, {useCallback} from "react";
import CardBrowser from "../elements/lists/CardBrowser";
import {FaUncharted} from "react-icons/fa";
import RuleForm from "../elements/forms/RuleForm";
import RuleDetails from "../elements/details/RuleDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";


export default function Rules() {

    const urlFunc = useCallback((query) => ('/rules/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <RuleForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDeleteComplete={close}
                                                                onEditComplete={close}/>, []);

    const ruleRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row,}}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           tags={[row.type]}
                                           deplomentTable="trigger"
                                           deleteEndpoint='/rule/'
                                           icon="trigger"
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Trigger Rules"
        description="Triggers prompt workflows when special things happen, deciding which one to run based on
        conditions like specific events or added segments. Each trigger has two parts: one decides when to start,
        and the other specifies the workflow. If the starting condition is met, the workflow begins."
        urlFunc={urlFunc}
        defaultLayout="rows"
        rowFunc={ruleRows}
        buttonLabel="New trigger"
        buttonIcon={<FaUncharted size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New trigger"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
