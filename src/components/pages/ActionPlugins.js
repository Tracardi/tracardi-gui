import React, {useCallback, useState} from "react";
import SquareCard from "../elements/lists/cards/SquareCard";
import PluginForm from "../elements/forms/PluginForm";
import CardBrowser from "../elements/lists/CardBrowser";
import FlowNodeIcons from "../flow/FlowNodeIcons";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import Button from "../elements/forms/Button";
import {IoRefreshCircle} from "react-icons/io5";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../remote_api/requestClient";

export function ReinstallButton() {

    const [progress, setProgress] = useState(false);
    const [error, setError] = useState(null);

    const {request} = useRequest()

    const handlePluginsReinstall = async () => {
        try {
            setError(null);
            setProgress(true);
            const response = await request({
                url: "/install/plugins"
            })

            if(response.status === 200) {
                setError(false)
            }
        } catch (e) {
            setError(true)
        } finally {
            setProgress(false)
        }
    }

    return <Button label="Plugins"
                   icon={<IoRefreshCircle size={20}/>}
                   onClick={handlePluginsReinstall}
                   progress={progress}
                   error={error}
                   confirmed={error === null ? null : !error}
    />
}


export default function ActionPlugins() {

    const urlFunc= useCallback((query) => ('/flow/action/plugins' + ((query) ? "?query=" + query : "")),[]);
    const detailsFunc=  useCallback((id) => <PluginForm id={id}/>, []);
    const [refresh, setRefresh] = React.useState(0);
    const confirm = useConfirm();
    const {request} = useRequest()

    const forceRefresh = () => {
        setRefresh(Math.random());
    }

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

        const onDelete = (id) => {
            confirm({title: "Are you sure you want to delete this plugin?", description: "This action can be undone by reinstalling plugins."})
            .then(() => {
                request({
                    url: `/flow/action/plugin/${id}`,
                    method: "DELETE"
                })
                .then(() => forceRefresh())
            })
            .catch(_ => {}) 
        }

        return Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="CardGroup" style={{width: "100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        const data = {
                            icon: row?.plugin?.metadata?.icon,
                            enabled: row?.settings?.enabled,
                            name: row?.plugin?.metadata?.name,
                            description: row?.plugin?.metadata?.desc,
                            version: row?.plugin?.spec?.version
                        }
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={data}
                                           status={row?.settings?.enabled}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={onDelete}
                                           forceMode='no-deployment'
                                           deleteEndpoint='/flow/action/plugin/'
                        >
                            {data.description} (v{data.version})
                        </BrowserRow>
                    })}
                </div>
            </div>
        })
    }



    return <>
        <div style={{display: "flex", justifyContent: "flex-end", margin: "0 15px"}}><ReinstallButton/></div>
        <CardBrowser
        label="Action plugins"
        urlFunc={urlFunc}
        cardFunc={pluginsCards}
        rowFunc={pluginsRows}
        defaultLayout="cards"
        drawerDetailsWidth={800}
        detailsFunc={detailsFunc}
        refresh={refresh}
    /></>
}
