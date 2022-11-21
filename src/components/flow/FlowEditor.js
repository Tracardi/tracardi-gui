import React, { useCallback, useEffect, useState } from 'react';
import {ReactFlowProvider} from 'react-flow-renderer';
import './FlowEditor.css'
import {useParams} from "react-router-dom";
import FormDrawer from "../elements/drawers/FormDrawer";
import FlowForm from "../elements/forms/FlowForm";
import FlowEditorPane from "./FlowEditorPane";
import {useDispatch} from "react-redux"
import {changeRoute} from "../../redux/reducers/appSlice"

const FlowEditor = () => {
    let {id} = useParams();
    const dispatch = useDispatch();

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [flowFormOpened, setFlowFormOpened] = useState(false);
    const [flowMetaData, setFlowMetaData] = useState(null);

    useEffect(() => {
      if (flowMetaData && flowMetaData.type) {
        if (flowMetaData.type === "collection") {
          dispatch(changeRoute({route: `/processing`}))
        } else if (flowMetaData.type === "segmentation") {
          dispatch(changeRoute({route: `/segmentation`}))
        }
      }
    }, [dispatch, flowMetaData])

    const onFlowLoad = useCallback((flowMetadata) => {
        setFlowMetaData(flowMetadata);
    }, []);

    // --- Editor ---

    const onEditorReady = (reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
    }

    return (
        <>
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
            </ReactFlowProvider>
        </>
    );
};

export default FlowEditor;