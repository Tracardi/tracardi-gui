import React, {useState} from "react";
import './FlowLogs.css';
import {FiAlertTriangle} from "react-icons/fi";
import {VscError} from "react-icons/vsc";
import {AiOutlineCheckCircle} from "react-icons/ai";
import JsonStringify from "../elements/misc/JsonStingify";

const FlowLogs = ({logs}) => {

    const Row = ({log}) => {

        const [showDetails, setShowDetails] = useState(false);

        const Icon = ({type}) => {
            let icon;
            if(type === 'warning') {
                icon = <FiAlertTriangle size={25} style={{color: 'orange', marginRight: 5}}/>
            } else if (type === 'error') {
                icon = <VscError size={25} style={{color: 'red', marginRight: 5}}/>
            } else {
                icon = <AiOutlineCheckCircle size={25} style={{color: 'green', marginRight: 5}}/>
            }

            return <span style={{minWidth: 35, display: "flex", alignItems: 'center'}}>{icon}</span>
        }

        return <div className="FlowLogRow" onClick={()=>setShowDetails(!showDetails)}>
            <div className="FlowLogMessage"><Icon type={log.type}/>{log.message} | {log.origin} | {log.module}.{log.class_name}</div>
            {showDetails && <div className="FlowLogDetails">
                <fieldset style={{width: "100%", margin: 5, padding: 10}}>
                    <legend>Log details</legend>
                    <JsonStringify data={log} unfold={true}/>
                </fieldset>

            </div>}
        </div>
    }

    return <div className="FlowLog">
        <div className="FlowLogHeader">Message</div>
        <div className="FlowLogRows">
            {Array.isArray(logs) && logs.map((log, index)=> {
                return <Row
                    key={index}
                    log={log}
                />
            })}
        </div>
    </div>

}

export default FlowLogs;