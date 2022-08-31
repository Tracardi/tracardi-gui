import React from "react";
import "./ServiceCard.css";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@mui/material/Chip";
import {BsPlusCircle} from "react-icons/bs";
import Button from "../forms/Button";

const ServiceCard = ({service, onClick}) => {
    return (
        <div className="ServiceCard">
            <div className="Title">
                <span>
                    <FlowNodeIcons icon={service?.metadata?.icon} size={30}/>
                    <span style={{marginLeft: 10}}>{service?.metadata?.name}</span>
                </span>
            </div>
            <div className="Desc">
                <div style={{marginBottom: 5}} className="Text">
                    {service?.metadata?.description}
                </div>
                <div className="Install">
                    <div style={{lineHeight: 2}}>
                        <div style={{borderBottom: "1px solid gray", textTransform: "uppercase", color: "gray", fontSize: 12}}>Installs</div>
                        {service?.metadata?.submit.map((tag, key) => <Chip size="small" key={key} label={tag} style={{marginRight: 5}}/>)}
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", marginTop: 10}}>
                        <Button label="Install" onClick={() => onClick(service)} icon={<BsPlusCircle size={20} style={{marginRight: 5}}/>}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceCard;