import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import CardBrowser from "../elements/lists/CardBrowser";
import {FaUncharted} from "react-icons/fa";
import RuleForm from "../elements/forms/RuleForm";
import RuleDetails from "../elements/details/RuleDetails";

export default function Rules() {

    const urlFunc = useCallback((query) => ('/rules/by_tag' + ((query) ? "?query=" + query : "")), [])
    const addFunc = useCallback((close) => <RuleForm onEnd={close}/>, [])
    const detailsFunc = useCallback((id, close) => <RuleDetails id={id} onDelete={close} onEdit={close}/>, []);

    const segments = (data, onClick) => {
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

    return <CardBrowser
        label="Rules"
        urlFunc={urlFunc}
        cardFunc={segments}
        buttomLabel="New rule"
        buttonIcon={<FaUncharted size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Rule details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New rule"
        drawerAddWidth={800}
        addFunc={addFunc}
        className="Pad10"
    />

}
