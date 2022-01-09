import React, {useCallback} from "react";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import AdvancedSquareCard from "../elements/lists/cards/AdvancedSquareCard";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {request} from "../../remote_api/uql_api_endpoint";
import {useConfirm} from "material-ui-confirm";


export default function Flows() {

    const urlFunc= useCallback((query) => ('/flows/by_tag' + ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <FlowForm projects={[]} onFlowSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <FlowDetails id={id} onDeleteComplete={close}/>, [])

    const history = useHistory();
    const confirm = useConfirm();

    const handleFlowEdit = (id) => {
        history.push(urlPrefix("/setup/flow/edit/" + id))
    }

    const onDelete = (id) => {
        confirm({title: "Do you want to delete this workflow?", description: "This action can not be undone."})
            .then(() => {
                    request({
                            url: '/flow/' + id,
                            method: "delete"
                        },
                        () => {},
                        () => {},
                        (result) => {
                            if (result !== false) {
                                request({
                                        url: '/flows/refresh'
                                    },
                                    ()=>{},
                                    ()=>{},
                                    ()=>{

                                    }
                                )
                            }
                        }
                    );

                }
            )
            .catch(() => {
            })
    }

    const flows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <AdvancedSquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<IoGitNetworkSharp size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}
                                           onEdit={handleFlowEdit}
                                           onDelete={onDelete}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Workflows"
        description="List of defined workflows. You may filter this list by workflow name in the upper search box."
        urlFunc={urlFunc}
        cardFunc={flows}
        buttomLabel="New workflow"
        buttonIcon={<IoGitNetworkSharp size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Workflow details"
        drawerDetailsWidth={900}
        detailsFunc={detailsFunc}
        drawerAddTitle="New workflow"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
