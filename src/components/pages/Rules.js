import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {FaUncharted} from "react-icons/fa";
import RuleForm from "../elements/forms/RuleForm";
import RuleDetails from "../elements/details/RuleDetails";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";

export default function Rules() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/rules/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <RuleForm onEnd={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDelete={close} onEdit={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this rule?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/rule/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

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
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                        />
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
        defaultLayout="rows"
        cardFunc={ruleCards}
        rowFunc={ruleRows}
        buttonLabel="New routing rule"
        buttonIcon={<FaUncharted size={20}/>}
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New routing rule"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
