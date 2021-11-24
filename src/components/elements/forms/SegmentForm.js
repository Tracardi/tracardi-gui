import React, {useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import FormDescription from "../misc/FormDescription";
import Columns from "../misc/Columns";
import Rows from "../misc/Rows";
import Form from "../misc/Form";
import FormHeader from "../misc/FormHeader";
import Switch from "@material-ui/core/Switch";
import {v4 as uuid4} from "uuid";
import {request} from "../../../remote_api/uql_api_endpoint";
import {remote} from "../../../remote_api/entrypoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import TuiSelectEventType from "../tui/TuiSelectEventType";

function SegmentForm({onSubmit, init, showAlert}) {

    if (!init) {
        init = {
            id: (!init?.id) ? uuid4() : init.id,
            eventType: "",
            condition: "",
            name: "",
            description: "",
            enabled: false
        }
    }

    const [name, setName] = useState(init.name);
    const [description, setDescription] = useState(init.description);
    const [condition, setCondition] = useState(init.condition);
    const [nameErrorMessage, setNameErrorMessage] = useState(null);
    const [conditionErrorMessage, setConditionErrorMessage] = useState(null);
    const [enabled, setEnabled] = useState(init.enabled);
    const [processing, setProcessing] = useState(false);
    const [type, setType] = useState(init.eventType);

    const onTqlValidate = async () => {
        try {
            const response = await remote({
                    url: '/tql/validate',
                    method: 'post',
                    data: condition
                }
            );
            if (response) {
                setConditionErrorMessage(null)
            }
            return true;
        } catch (e) {
            setConditionErrorMessage("Could not parse condition.")
            return false;
        }

    }

    const _onSubmit = async () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage(null);
            }
            if (!condition || condition.length === 0) {
                setConditionErrorMessage("Condition can not be empty");
            } else {
                setConditionErrorMessage(null);
            }
            return;
        }

        if (!await onTqlValidate()) {
            return;
        }

        const payload = {
            id: (!init?.id) ? uuid4() : init.id,
            name: name,
            description: description,
            eventType: type.id,
            condition: condition,
            enabled: enabled,
        }

        setProcessing(true);
        request({
                url: '/segment',
                method: 'post',
                data: payload
            },
            setProcessing,
            (e) => {
                if(e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 5000});
                }
            },
            (response) => {
                if (response!==false) {
                    request({
                            url: '/segments/refresh'
                        },
                        setProcessing,
                        ()=>{},
                        ()=>{
                            if (onSubmit) {
                                onSubmit(payload)
                            }
                        }
                    )
                }
            },
        )

    }

    return <Form>
        <Columns>
            <FormHeader>Segmentation</FormHeader>
            <ElevatedBox>
                <FormSubHeader>Event type</FormSubHeader>
                <FormDescription>Bind this segment event type. You can select None then segment will be checked at every
                    event.
                    against all events.</FormDescription>
                <TuiSelectEventType value={{name:type, id:type}} onSetValue={setType}/>

                <FormSubHeader>Condition</FormSubHeader>
                <FormDescription>Segments are created after the event is processed.
                    Then Profile properties are evaluated against the condition you type below.
                    If profile meets the requirements then it will be assigned to the segment. </FormDescription>
                <TextField
                    label={"Set segment condition"}
                    value={condition}
                    multiline
                    rows={3}
                    error={(typeof conditionErrorMessage !== "undefined" && conditionErrorMessage !== '' && conditionErrorMessage !== null )}
                    helperText={conditionErrorMessage ? conditionErrorMessage : "Condition example: stats.visits>10 AND properties.public.boughtProducts>1"}
                    onChange={(ev) => {
                        setCondition(ev.target.value)
                    }}
                    onBlurCapture={onTqlValidate}
                    variant="outlined"
                    fullWidth
                />
                <FormSubHeader>Activation</FormSubHeader>
                <FormDescription>Set if this segment is active. </FormDescription>
                <div style={{display: "flex", alignItems: "center"}}>
                    <Switch
                        checked={enabled}
                        onChange={() => setEnabled(!enabled)}
                        name="enabledSegment"
                    />
                    <span>Enable/Disable segment</span>
                </div>

            </ElevatedBox>

            <FormHeader>Describe segment</FormHeader>
            <ElevatedBox>
                <FormSubHeader>Name</FormSubHeader>
                <FormDescription>The segment name will be its id, after spaces are replaced with dashes and letters
                    lowercased
                </FormDescription>
                <TextField
                    label={"Segment name"}
                    error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null )}
                    helperText={nameErrorMessage}
                    value={name}
                    onChange={(ev) => {
                        setName(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

                <FormSubHeader>Description <sup style={{fontSize: "70%"}}>* optional</sup></FormSubHeader>
                <FormDescription>Description will help you to understand when the segment condition is applied.
                </FormDescription>
                <TextField
                    label={"Segment description"}
                    value={description}
                    multiline
                    rows={3}
                    onChange={(ev) => {
                        setDescription(ev.target.value)
                    }}
                    variant="outlined"
                    fullWidth
                />

            </ElevatedBox>
        </Columns>
        <Rows style={{paddingLeft: 30}}>
            <Button label="Save" onClick={_onSubmit} progress={processing}/>
        </Rows>

    </Form>
}

SegmentForm.propTypes = {onSubmit: PropTypes.func, init: PropTypes.object}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(SegmentForm)