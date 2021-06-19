import React from "react";
import "./ListDetailView.css"

export default function ListDetailView({list, detail}) {
    return (
        <div className="ListDetailView">
            <div className="ListDetailViewLeftColumn">
                {list()}
            </div>
            <div className="ListDetailViewRightColumn">
                {detail()}
            </div>
        </div>

    );
}
