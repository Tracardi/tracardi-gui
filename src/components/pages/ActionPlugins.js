import React, {useCallback} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import PluginForm from "../elements/forms/PluginForm";
import CardBrowser from "../elements/lists/CardBrowser";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import BrowserRow from "../elements/lists/rows/BrowserRow";

export default function ActionPlugins() {

    const urlFunc= useCallback((query) => ('/flow/action/plugins' + ((query) ? "?query=" + query : "")),[]);
    const detailsFunc=  useCallback((id) => <PluginForm id={id}/>, []);

    const pluginsCards = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <SquareCard key={index+"-"+subIndex}
                                           id={row?.id}
                                           icon={<FlowNodeIcons icon={row?.plugin?.metadata?.icon} size={35}/>}
                                           status={row?.settings?.enabled}
                                           name={row?.plugin?.metadata?.name}
                                           description={row?.plugin?.metadata?.desc}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    const pluginsRows = (data, onClick) => {
        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            icon: row?.plugin?.metadata?.icon,
                            enabled: row?.settings?.enabled,
                            name: row?.plugin?.metadata?.name,
                            description: row?.plugin?.metadata?.desc
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           onClick={() => onClick(row?.id)}/>
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Action plugins"
        urlFunc={urlFunc}
        cardFunc={pluginsCards}
        rowFunc={pluginsRows}
        defaultLayout="rows"
        drawerDetailsTitle="Edit Plugin Action"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
    />
}
