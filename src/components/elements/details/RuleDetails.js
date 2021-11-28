import React from "react";
import "./Details.css";
import "./RuleDetails.css";
import ConfirmationDialog from "../misc/ConfirmationDialog";
import Button from "../forms/Button";
import UqlDetails from "./UqlDetails";
import {useHistory} from "react-router-dom";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import urlPrefix from "../../../misc/UrlPrefix";
import Rows from "../misc/Rows";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";


function RuleDetails({data, onDelete, onEdit}) {

    const history = useHistory();
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const onEditClick = () => {
        if (data) {
            onEdit(data);
        }
    }

    const onGoToFlow = () => {
        history.push(urlPrefix("/setup/flow/") + data?.flow?.id);
    }

    const onDeleteClick = () => {
        if (data) {
            setOpenConfirmation(true);
        }
    }

    const onConfirmedDelete = () => {
        setOpenConfirmation(false);
        if (data?.id) {
            onDelete(data?.id);
        }
    }

    const onDeleteClose = () => {
        setOpenConfirmation(false);
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header={data?.name} description="Please find below rule logic that will trigger the workflow."/>
            <TuiFormGroupContent>
                <TuiFormGroupContent >
                    <TuiFormGroupField description={data?.description}>
                        {data && <UqlDetails data={data} type="Rule"/>}

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
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <ConfirmationDialog open={openConfirmation} title="Do you want to delete this rule?"
                            content="This action can not be undone." onClose={onDeleteClose}
                            onAgree={onConfirmedDelete}
        />
    </TuiForm>

}

RuleDetails.propTypes = {
    data: PropTypes.object,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
  };

export default RuleDetails;
