import React from "react";
import "./TopInfoBar.css";

export default function TopInfoBar({children, buttons}) {

    const renderButtons = () => {
        if(Array.isArray(buttons)) {
            return buttons.map((v, index) => {
                return <span key={index}>{v}</span>;
            });
        }
    }

    return <nav className="TopInfoBar">
        <div className="Path">
            {children}
        </div>
        <div className="ActionButtons">
            {renderButtons()}
        </div>
    </nav>
}