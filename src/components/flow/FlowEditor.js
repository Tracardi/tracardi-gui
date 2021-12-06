import React, {useCallback, useEffect, useState} from 'react';
import {
    ReactFlowProvider
} from 'react-flow-renderer';
import './FlowEditor.css'
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import FormDrawer from "../elements/drawers/FormDrawer";
import FlowForm from "../elements/forms/FlowForm";
import FlowEditorPane from "./FlowEditorPane";
import {save} from "./FlowEditorOps";
import FlowEditorTitle from "./FlowEditorTitle";
import {useConfirm} from "material-ui-confirm";

const FlowEditor = ({showAlert}) => {

    let {id} = useParams();

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState(null)
    const [modified, setModified] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const confirm = useConfirm();

    const onFlowLoad = useCallback((flowMetadata) => {
        setFlowMetaData(flowMetadata);
    }, []);

    const onSaveDraft = useCallback((deploy = false) => {

        if (reactFlowInstance) {
            save(id,
                flowMetaData,
                reactFlowInstance,
                (e) => {
                    showAlert(e)
                },
                () => {
                    setModified(false);
                    if (deploy) {
                        setDeployed(true);
                    }
                },
                () => {
                },
                deploy);
        } else {
            console.error("Can not save Editor not ready.");
        }
    }, [flowMetaData, reactFlowInstance, id, showAlert]);

    useEffect(() => {
        const timer = setInterval(
            () => {
                if (modified === true) {
                    onSaveDraft(false);
                }
            },
            5000
        );

        return () => {
            if (timer) {
                clearInterval(timer);
            }

        };
    }, [modified, onSaveDraft])

    const onConfig = () => {
        setModified(true);
        setDeployed(false);
    }

    // --- Editor ---

    const onEditorReady = (reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
    }

    const onChange = () => {
        setModified(true);
        setDeployed(false);
    }

    const onDeploy = () => {
        confirm({
            title: "Do you want to deploy this flow?",
            description: "After deployment this flow will be used in production.\n" +
                "This action can not be undone."
        }).then(
            () => onSaveDraft(true)
        ).catch(() => {
        })

    }

    return (
        <>
            <ReactFlowProvider>
                <FlowEditorTitle
                    title={flowMetaData?.name}
                    modified={modified}
                    deployed={deployed}
                    onSave={() => onSaveDraft(false)}
                    onDeploy={() => onDeploy()}
                />
                <div className="FlowEditor">
                    <div className="WorkArea">
                        <FlowEditorPane id={id}
                                        onEdit={() => setFlowFormOpened(true)}
                                        reactFlowInstance={reactFlowInstance}
                                        onEditorReady={onEditorReady}
                                        onFlowLoad={onFlowLoad}
                                        onChange={onChange}
                                        onConfig={onConfig}
                                        draft={true}
                                        schema={flowMetaData?.wf_schema}
                        />
                    </div>
                </div>
                <FormDrawer
                    width={800}
                    label="Flow details"
                    onClose={() => {
                        setFlowFormOpened(false)
                    }}
                    open={flowFormOpened}>
                    <FlowForm id={id}
                              name={flowMetaData?.name}
                              description={flowMetaData?.description}
                              enabled={flowMetaData?.enabled}
                              projects={flowMetaData?.projects}
                              draft={true}
                              onFlowSaveComplete={({name, description, enabled, projects}) => {
                                  setFlowMetaData({name, description, enabled, projects});
                                  setFlowFormOpened(false)
                              }}/>
                </FormDrawer>
            </ReactFlowProvider>
        </>
    );
};

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowEditor)