import React from 'react';
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {BsGear} from "react-icons/bs";
import IconButton from "../../misc/IconButton";
import TuiTags from "../../tui/TuiTags";
import {StatusPoint} from "../../misc/StatusPoint";
import DeployButton from "../../forms/buttons/DeploymentButton";

const BrowserRow = ({id, data, onClick, onDelete, onSettingsClick, deplomentTable=null, tags, children, status, lock}) => {

    const description = children ? children : data.description

    return (
        <div style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", borderBottom: "solid 1px rgba(128,128,128,.3)", padding: "0 10px"}}>
            <div 
                style={{
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                    fontSize: 14,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0"
                }}
                onClick={(ev) => {
                    onClick(id)
                }}
            >

                <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                    <span style={{opacity: "60%", display: "flex", width: 30}}><FlowNodeIcons icon={data?.icon} size={22}/></span>
                    <div style={{display: "flex", flexDirection:"column", marginLeft: 10, gap: 5}}>
                        <div className="flexLine" style={{fontSize: 18, marginRight: 5, fontWeight: 500}}>{data.name}</div>
                        {description && <div className="flexLine">{description}</div>}
                    </div>
                </div>
                <div className="flexLine" style={{gap: 3}}>
                    {Array.isArray(tags) && <TuiTags tags={tags} size="small"/>}
                    {lock && <FlowNodeIcons icon="lock" size={22}/>}
                    {typeof  status !== 'undefined'  && <StatusPoint status={status}/>}
                </div>

            </div>

            {onSettingsClick instanceof Function && <IconButton label={"Settings"}
                                                                style={{color:"black"}}
                                                                onClick={() => onSettingsClick(id)}>
                <BsGear size={20}/>
            </IconButton>}

            <DeployButton id={id}
                          production={data?.production}
                          running={data?.running}
                          deplomentTable={deplomentTable}
                          onDelete={onDelete}
            />

        </div>
    );
}

export default BrowserRow;
