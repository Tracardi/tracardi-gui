import React, {useState} from "react";
import IconButton from "../elements/misc/IconButton";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import './NodeDetails.css';
import {VscJson} from "react-icons/vsc";
import ConsoleView from "../elements/misc/ConsoleView";

const EdgeDetails = React.memo(({edge, onLabelSubmit}) => {

    const [tab, setTab] = useState(0);

    const handleSubmit = (value) => {
        if (onLabelSubmit instanceof Function) {
            onLabelSubmit(value)
        }
    }

    return  <div className="NodeDetails">
        <div className="NodeDetailsIcons">
            <IconButton label="Raw" onClick={() => setTab(0)} selected={tab === 0} size="large">
                <VscJson size={22}/>
            </IconButton>
        </div>
        <div className="NodeDetailsContent">
            <div className="Title">
                    <FilterTextField label="Edge name"
                                     initValue={edge?.data?.name}
                                     onSubmit={handleSubmit}/>

            </div>
            <div className="Pane">
                {tab === 0 && <ConsoleView label="Edge JSON object" data={edge}/>}
            </div>
        </div>

    </div>
})

export default EdgeDetails;