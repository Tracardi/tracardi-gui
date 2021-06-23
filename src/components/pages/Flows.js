import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscCircuitBoard} from "@react-icons/all-files/vsc/VscCircuitBoard";


export default function Flows() {

    const flows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup">
                <header key={index}>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscCircuitBoard size={45}/>}
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
        urlFunc={(query) => ('/flows/by_tag' + ((query) ? "?query=" + query : ""))}
        cardFunc={flows}
        buttomLabel="New flow"
        buttonIcon={<IoGitNetworkSharp size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Flow details"
        drawerDetailsWidth={800}
        detailsFunc={(id, close) => <FlowDetails id={id} onDeleteComplete={close}/>}
        drawerAddTitle="New flow"
        drawerAddWidth={800}
        addFunc={(close) => <FlowForm projects={[]} onFlowSaveComplete={close}/>}
    />
}
