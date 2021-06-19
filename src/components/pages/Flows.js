import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import FlowForm from "../elements/forms/FlowForm";
import FlowDetails from "../elements/details/FlowDetails";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {VscCircuitBoard} from "@react-icons/all-files/vsc/VscCircuitBoard";


export default function Flows() {

    const flows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup">
                <header key={index}>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index + "-" + subIndex}
                                           id={row?.id}
                                           icon={<VscCircuitBoard size={45}/>}
                                           status={row?.enabled}
                                           name={row?.name}
                                           description={row?.description}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        urlFunc={(query) => ('/flows/by_tag' + ((query) ? "?query=" + query : ""))}
        cardFunc={flows}
        buttomLabel="New flow"
        buttonIcon={<IoGitNetworkSharp size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Flow details"
        drawerDetailsWidth={800}
        detailsFunc={(id, close) => <FlowDetails id={id} onDeleteComplete={close}/>}
        drawerAddTitle="New flow"
        drawerAddWidth={800}
        addFunc={(close) => <FlowForm projects={[]} onFlowSaveComplete={close}/>}
    />
}

// const Flows = ({showAlert}) => {
//
//     const [flowNewOpened, setFlowNewOpened] = useState(false);
//     const [flowId, setFlowId] = React.useState(null);
//
//     const onClick = (id) => {
//         setFlowId(id)
//     }
//
//     const onDeleteComplete = (id) => {
//         setFlowId(null);
//     }
//
//     const blocks = () => {
//         return <StandardFilteredList
//             newButtonLabel="New Flow"
//             newButtonIcon={<BsFolderPlus size={20} style={{marginRight: 10}}/>}
//             newButtonOnClick={() => {
//                 setFlowNewOpened(true)
//             }}
//             endPoinyUrl="/flows/by_tag"
//             renderList={
//                 (data) => {
//                     return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
//                         return <div className="CardGroup">
//                             <header key={index}>{category}</header>
//                             <div>
//                                 {plugs.map((row, subIndex) => {
//                                     return <SquareCard key={index + "-" + subIndex}
//                                                        id={row?.id}
//                                                        icon={<IoGitNetworkSharp size={45}/>}
//                                                        status={row?.enabled}
//                                                        name={row?.name}
//                                                        description={row?.description}
//                                                        onClick={() => onClick(row?.id)}/>
//                                 })}
//                             </div>
//                         </div>
//                     })
//                 }
//             }
//             filterLabel="Type condition to filter flows"
//             filterKey="filterFlowQuery"
//         />
//     }
//
//     return <div className="CardBrowser">
//         {blocks()}
//         <FormDrawer
//             width={800}
//             label="New Flow"
//             onClose={() => {
//                 setFlowNewOpened(false)
//             }}
//             open={flowNewOpened}>
//             <FlowForm
//                 projects={[]}
//                 onFlowSaveComplete={() => {
//                 setFlowNewOpened(false)
//             }}/>
//         </FormDrawer>
//         <FormDrawer
//             width={800}
//             label="Flow details"
//             onClose={() => {
//                 setFlowId(null)
//             }}
//             open={flowId !== null}>
//             {flowId && <FlowDetails id={flowId}
//                                     onDeleteComplete={onDeleteComplete}
//             />}
//         </FormDrawer>
//     </div>
// }
//
// const mapProps = (state) => {
//     return {}
// }
// export default connect(
//     mapProps,
//     {showAlert}
// )(Flows)
