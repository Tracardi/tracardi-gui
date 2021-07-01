import React from "react";
import DetailHeader from "./DetailHeader";
import "./Details.css";
import "./RuleDetails.css";
import ConfirmationDialog from "../misc/ConfirmationDialog";
import Button from "../forms/Button";
import BluredBox from "../misc/BluredBox";
import UqlDetails from "./UqlDetails";
import {useHistory} from "react-router-dom";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import urlPrefix from "../../../misc/UrlPrefix";
import ElevatedBox from "../misc/ElevatedBox";
import Rows from "../misc/Rows";
import FormDescription from "../misc/FormDescription";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";


function RuleDetails({data, onDelete, onEdit}) {

    const history = useHistory();
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const onEditClick = () => {
        if (data) {
            onEdit(data);
        }
    }

    const onGoToFlow = () => {
        history.push(urlPrefix("/setup/flow/") + data.flow.id);
    }

    const onDeleteClick = () => {
        if (data) {
            setOpenConfirmation(true);
        }
    }

    const onConfirmedDelete = () => {
        setOpenConfirmation(false);
        if (data.id) {
            onDelete(data.id);
        }
    }

    const onDeleteClose = () => {
        setOpenConfirmation(false);
    }

    const isChrome = !!window.chrome;

    const detailBoxStyle = (isChrome)
        ? {zIndex: 5, backgroundColor: "rgba(255,255,255,.3)", marginBottom: 0}
        : {zIndex: 5, marginBottom: 0};

    return <div style={{height: "inherit"}}>
        <DetailHeader label={data.name}/>

        <div className="RightTabScroller" style={{height: "calc(100% - 122px)", overflowY: "scroll"}}>

            <BluredBox style={{position: "sticky", top: 8}}>

                <ElevatedBox style={detailBoxStyle}>

                    {data && <UqlDetails data={data} type="Rule"/>}

                    {data.description && <FormDescription style={{marginTop: 20}}>
                        {data.description}
                    </FormDescription>}

                    <Rows style={{marginTop: 20}}>
                        {onEditClick && <Button onClick={onEditClick}
                                                icon={<VscEdit size={20}/>}
                                                label="Edit"
                                                disabled={typeof data === "undefined"}/>}
                        <Button onClick={onGoToFlow}
                                icon={<IoGitNetworkSharp size={20} style={{marginRight: 5}}/>}
                                label="Go to FLOW"
                                disabled={typeof data === "undefined"}/>
                        {onDeleteClick && <Button onClick={onDeleteClick}
                                                  label="Delete"
                                                  icon={<VscTrash size={20} style={{marginRight: 5}}/>}
                                                  disabled={typeof data === "undefined"}/>}
                    </Rows>

                    <ConfirmationDialog open={openConfirmation} title="Do you want to delete this rule?"
                                        content="This action can not be undone." onClose={onDeleteClose}
                                        onAgree={onConfirmedDelete}
                    />

                </ElevatedBox>

            </BluredBox>

        </div>

    </div>

}

export default RuleDetails;
