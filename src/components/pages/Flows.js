import React, {useCallback} from "react";
import {BsGear} from "react-icons/bs";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {useNavigate} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {Chip} from "@mui/material";


export default function Flows({defaultLayout="rows", type="collection", label}) {

    const urlFunc = useCallback((query) => (`/flows/by_tag?type=${type}` + ((query) ? "&query=" + query : "")), [type]);
    const addFunc = useCallback((close) => <FlowForm type={type} projects={[]} onFlowSaveComplete={close} />, [type])
    const detailsFunc = useCallback((id, close) => <FlowDetails id={id} onDeleteComplete={close}/>, [])

    const navigate = useNavigate();

    const handleFlowEdit = (id) => {
        navigate(urlPrefix(`/flow/${type}/edit/${id}`))
    }

    const flowRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={row}
                                           onClick={handleFlowEdit}
                                           onSettingsClick={onClick}
                                           tags={[row.type]}
                                           deplomentTable="workflow"
                                           icon={row.type==='collection' ? "flow" : "segment"}
                                           deleteEndpoint='/flow/'
                        >
                            {row.description && <span style={{marginRight: 5}}>{row.description}</span>} {row.deployed && <Chip
                            label="Deployed"
                            size="small"/>}
                        </BrowserRow>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label={label}
        defaultLayout={defaultLayout}
        description="List of defined workflows. You may filter this list by workflow name in the upper search box."
        urlFunc={urlFunc}
        rowFunc={flowRows}
        buttonLabel="New workflow"
        buttonIcon={<BsGear size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New workflow"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
