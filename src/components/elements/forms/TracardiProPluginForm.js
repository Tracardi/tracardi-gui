import React, {useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {objectMap} from "../../../misc/mappers";
import TuiSelectResource from "../tui/TuiSelectResource";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {JsonForm} from "./JsonForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
// import FormSchema from "../../../domain/formSchema";

export function TracardiProPluginForm({value, errorMessage, onSubmit}) {

    const [actions, setActions] = useState({})
    const [actionsDisabled, setActionsDisabled] = useState(true)
    const [forms, setForms] = useState({})
    const [selectedAction, setSelectedAction] = useState("")
    const [selectedForm, setSelectedForm] = useState(null)
    const [actionFormData, setActionFormData] = useState({})
    // const [formErrorMessages, setFormErrorMessages] = useState({});
    // const [saveOK, setSaveOk] = useState(false);

    const handleResourceChange = async (value) => {

        if (value === null) {
            setActionsDisabled(true);
        } else {
            try {
                const response = await asyncRemote({
                    url: `/tracardi-pro/service/${value.id}/actions`
                })

                if (response.status === 200) {
                    setForms(response.data)
                    let ids = {}
                    objectMap(response.data, (key, values) => {
                        ids[key] = values['name']
                    })
                    setActions(ids);
                    setActionsDisabled(false)
                }

            } catch (e) {

            }
        }


    };

    const handleActionChange = async (value) => {
        setSelectedAction(value);
        setActionFormData({})
        if (value in forms) {
            setSelectedForm(forms[value].form)
        }
    }

    const handleActionFormChange = (value) => {
        setActionFormData(MutableMergeRecursive(actionFormData, value))
    }

    const handleActionFormSubmit = () => {
        if(onSubmit) {
            onSubmit(actionFormData)
        }

        // const form = new FormSchema(selectedForm)
        // form.validate(pluginId, actionFormData).then(
        //     (result) => {
        //         if (result === true) {
        //
        //             if(formErrorMessages !== {}) {
        //                 setFormErrorMessages({})
        //             }
        //
        //             // onSubmit(actionFormData)
        //             setSaveOk(true)
        //
        //         } else {
        //             setFormErrorMessages(result);
        //             setSaveOk(false)
        //         }
        //     }
        // )
    }

    return <div>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Tracardi Pro Service select"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Resource"
                                       description="Select Tracardi Pro resource you would like to use.">
                        <TuiSelectResource value={value} errorMessage={errorMessage} onSetValue={handleResourceChange}
                                           tag={"pro"}/>
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Available actions" description="Select action you would like to make.">
                        <TextField select fullWidth
                                   value={selectedAction}
                                   variant="outlined"
                                   size="small"
                                   label="Available actions"
                                   disabled={actionsDisabled}
                                   onChange={(e) => handleActionChange(e.target.value)}>
                            {objectMap(actions, (key, value) => {
                                return <MenuItem key={key} value={key}>
                                    {value}
                                </MenuItem>
                            })}
                        </TextField>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {selectedForm && <JsonForm schema={selectedForm}
                                   onChange={handleActionFormChange}
                                   onSubmit={handleActionFormSubmit}
        />}
    </div>

}