import React, {useCallback, useState} from 'react';
import {ReactFlowProvider} from 'react-flow-renderer';
import './FlowEditor.css'
import {useParams} from "react-router-dom";
import FormDrawer from "../elements/drawers/FormDrawer";
import FlowForm from "../elements/forms/FlowForm";
import FlowEditorPane from "./FlowEditorPane";


const FlowEditor = () => {

    let {id} = useParams();

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState(null);

    const onFlowLoad = useCallback((flowMetadata) => {
        setFlowMetaData(flowMetadata);
    }, []);

    // --- Editor ---

    const onEditorReady = (reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
    }

    return (
        <div style={{height: "100%"}}>
            <ReactFlowProvider>
                <FlowEditorPane id={id}
                                flowMetaData={flowMetaData}
                                onEdit={() => setFlowFormOpened(true)}
                                reactFlowInstance={reactFlowInstance}
                                onEditorReady={onEditorReady}
                                onFlowLoad={onFlowLoad}
                                draft={true}
                                schema={flowMetaData?.wf_schema}
                />
            </ReactFlowProvider>
            <FormDrawer
                width={800}
                onClose={() => {
                    setFlowFormOpened(false)
                }}
                open={flowFormOpened}>
                <FlowForm id={id}
                          name={flowMetaData?.name}
                          description={flowMetaData?.description}
                          projects={flowMetaData?.projects}
                          draft={true}
                          type={flowMetaData?.type}
                          disableType={true}
                          onFlowSaveComplete={(payload) => {
                              setFlowMetaData(payload);
                              setFlowFormOpened(false)
                          }}/>
            </FormDrawer>
        </div>
    );
};

export default FlowEditor;