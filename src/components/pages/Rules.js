import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {FaUncharted} from "react-icons/fa";
import RuleForm from "../elements/forms/RuleForm";
import RuleDetails from "../elements/details/RuleDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function Rules() {

    const urlFunc = useCallback((query) => ('/rules/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <RuleForm onEnd={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDelete={close} onEdit={close}/>, []);

    const ruleCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<FaUncharted size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const ruleRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "route"}}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Routing Rules"
        description="Routing rules connect incoming events with the workflows. Routing defines which workflow is to be
        executed when an event reaches the system. It consist of a condition and a workflow name.
        If a condition is met then the flow is triggered. "
        urlFunc={urlFunc}
        cardFunc={ruleCards}
        rowFunc={ruleRows}
        buttomLabel="New routing rule"
        buttonIcon={<FaUncharted size={20}/>}
        drawerDetailsTitle="Rule details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New routing rule"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
