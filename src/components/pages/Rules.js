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
    const addFunc = useCallback((close) => <RuleForm onSubmit={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDeleteComplete={close} onEditComplete={close}/>, []);

    const confirm = useConfirm();

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this trigger rule?", description: "This action can not be undone."})
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
                                           data={{...row, icon: "trigger"}}
                                           status={row?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           tags={[row.type]}
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
        cardFunc={ruleCards}
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
