import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";


export default function Flows() {

    const urlFunc= useCallback((query) => ('/flows/by_tag' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <FlowForm projects={[]} onFlowSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <FlowDetails id={id} onDeleteComplete={close}/>, [])

    const flows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<IoGitNetworkSharp size={45}/>}
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
        urlFunc={urlFunc}
        cardFunc={flows}
        buttomLabel="New flow"
        buttonIcon={<IoGitNetworkSharp size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Flow details"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        drawerAddTitle="New flow"
        drawerAddWidth={800}
        addFunc={addFunc}
    />
}
