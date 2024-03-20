// import React, {useCallback} from "react";
// import CardBrowser from "../elements/lists/CardBrowser";
// import {VscOrganization} from "react-icons/vsc";
// import SegmentForm from "../elements/forms/SegmentForm";
// import SegmentDetails from "../elements/details/SegmentDetails";
//
// export default function PostEventSegments() {
//
//     const urlFunc = useCallback((query) => ('/segments' + ((query) ? "?query=" + query : "")), [])
//     const addFunc = useCallback((close) => <SegmentForm onSubmit={close}/>, [])
//     const detailsFunc = useCallback((id, close) => <SegmentDetails id={id} onDeleteComplete={close}/>, []);
//
//     return <CardBrowser
//         label="Segments Tagging"
//         description="Segmentation tagging is triggered every time the profile is updated. It evaluates the segment tagging condition and
//         if it is met then the profile is tagged with defined segment name. Segment tags can be added dynamically inside the workflow."
//         urlFunc={urlFunc}
//         buttonLabel="New segment"
//         buttonIcon={<VscOrganization size={20}/>}
//         drawerDetailsWidth={800}
//         detailsFunc={detailsFunc}
//         drawerAddTitle="New segment"
//         drawerAddWidth={800}
//         addFunc={addFunc}
//         className="Pad10"
//         deploymentTable="segment"
//         deleteEndpoint='/segment/'
//         icon="segment"
//     />
//
// }
