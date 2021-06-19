import React from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";
import PluginForm from "../elements/forms/PluginForm";
import {BsFolderPlus} from "@react-icons/all-files/bs/BsFolderPlus";
import CardBrowser from "../elements/lists/CardBrowser";

export default function ActionPlugins() {

    const plugins = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup">
                <header key={index}>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index+"-"+subIndex}
                                           id={row?.id}
                                           icon={<VscPlug size={45}/>}
                                           status={row?.settings?.enabled}
                                           name={row?.plugin?.metadata?.name}
                                           description={row?.plugin?.metadata?.desc}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        urlFunc={(query) => ('/flow/action/plugins' + ((query) ? "?query=" + query : ""))}
        cardFunc={plugins}
        buttomLabel={"Add plugin"}
        buttonIcon={<BsFolderPlus size={20} style={{marginRight: 10}}/>}
        drawerDetailsTitle="Edit Plugin Action"
        drawerDetailsWidth={600}
        detailsFunc={(id) => <PluginForm id={id}/>}
    />
}


// export default function ActionPlugins() {
//
//     const [plugins, setPlugins] = useState(null);
//     const [pluginId, setPluginId] = useState(null);
//     const [query, setQuery] = useState(null);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         setPlugins(null);
//         setLoading(true);
//         const url = '/flow/action/plugins' + ((query) ? "?query="+query : "")
//         request({
//                 url
//             },
//             setLoading,
//             () => {
//             },
//             (response) => {
//                 if(response) {
//                     console.log(response.data)
//                     setPlugins(response.data);
//                 }
//             }
//         )
//     }, [query])
//
//     const onClick = (id) => {
//         setPluginId(id);
//     }
//
//     const Plugins = ({data}) => {
//         return Object.entries(data?.grouped).map(([k,plugs], index) => {
//                 return <div className="PlugGroup">
//                     <header key={index}>{k}</header>
//                     <div>
//                         {plugs.map((row, index) => {
//                             return <SquareCard key={index}
//                                                id={row?.id}
//                                                icon={<VscPlug size={45}/>}
//                                                status={row?.settings?.enabled}
//                                                name={row?.plugin?.metadata?.name}
//                                                description={row?.plugin?.metadata?.desc}
//                                                onClick={() => onClick(row?.id)}/>
//                         })}
//                     </div>
//                 </div>
//             })
//     }
//
//     const onFilter = (query) => {
//         setQuery(query);
//     }
//
//     const onAdd = () => {
//         setPluginId("1")
//     }
//
//     return <div className="ActionPlugins">
//         <FilterAddForm
//             textFieldLabel="Type to filter"
//             buttonLabel="Add plugin"
//             buttonIcon={<BsFolderPlus size={20} style={{marginRight: 10}}/>}
//             onFilter={onFilter}
//             onAdd={onAdd} />
//
//         {loading && <CenteredCircularProgress/>}
//         {plugins && <Plugins data={plugins} />}
//
//         <FormDrawer
//             width={600}
//             label="Edit Plugin Action"
//             onClose={()=>{setPluginId(null)}}
//             open={pluginId !== null}>
//             {pluginId && <PluginForm id={pluginId}/>}
//         </FormDrawer>
//
//     </div>
// }