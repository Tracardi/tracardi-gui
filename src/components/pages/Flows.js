import React, {useCallback, useEffect, useRef, useState} from "react";
import {IoGitNetworkSharp} from "react-icons/io5";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import AdvancedSquareCard from "../elements/lists/cards/AdvancedSquareCard";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../remote_api/entrypoint";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {Chip} from "@mui/material";


export default function Flows({defaultLayout="rows", type="collection"}) {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => (`/flows/by_tag?type=${type}` + ((query) ? "&query=" + query : "")), [type]);
    const addFunc = useCallback((close) => <FlowForm type={type} projects={[]} onFlowSaveComplete={close} />, [type])
    const detailsFunc = useCallback((id, close) => <FlowDetails id={id} onDeleteComplete={close}/>, [])

    const history = useHistory();
    const confirm = useConfirm();

    const handleFlowEdit = (id) => {
        history.push(urlPrefix("/flow/edit/" + id))
    }

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this workflow?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/flow/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
    }

    const flowCards = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <AdvancedSquareCard key={index + "-" + subIndex}
                                                   id={row?.id}
                                                   icon={<IoGitNetworkSharp size={45}/>}
                                                   name={row?.name}
                                                   onClick={() => onClick(row?.id)}
                                                   onEdit={handleFlowEdit}
                                                   onDelete={handleDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    const flowRows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: row.type==='collection' ? "flow" : "segment"}}
                                           onClick={handleFlowEdit}
                                           onDelete={handleDelete}
                                           onSettingsClick={onClick}
                        >
                            {`${row.description} (${row.type})`} {row.deployed && <Chip
                            label="Deployed"
                            style={{marginLeft: 5}}
                            size="small"/>}
                        </BrowserRow>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Workflows"
        defaultLayout={defaultLayout}
        description="List of defined workflows. You may filter this list by workflow name in the upper search box."
        urlFunc={urlFunc}
        cardFunc={flowCards}
        rowFunc={flowRows}
        buttomLabel="New workflow"
        buttonIcon={<IoGitNetworkSharp size={20}/>}
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New workflow"
        drawerAddWidth={600}
        addFunc={addFunc}
        refresh={refresh}
    />
}
