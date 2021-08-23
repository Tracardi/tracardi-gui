import React from "react";
import AlertBox from "../errors/AlertBox";
import './NoPortData.css';

export function NoPortData({input, label}) {

    const renderContent = () => {
        if(input === true) {
            return <AlertBox>Port output has no data. It means that this node will not execute and the incoming connection is inactive.</AlertBox>
        }
        return <AlertBox>Port has no data. This means that next nodes connected to this port will not execute.</AlertBox>
    }

    return <section>
            <div className="PortTitle">
                {label}
            </div>
            <div>
                {renderContent()}
            </div>
    </section>

}