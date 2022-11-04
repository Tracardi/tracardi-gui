import React, {useState} from "react";
import './FlowLogs.css';
import {FiAlertTriangle} from "react-icons/fi";
import {VscError} from "react-icons/vsc";
import {AiOutlineCheckCircle} from "react-icons/ai";
import JsonStringify from "../elements/misc/JsonStingify";
import DateValue from "../elements/misc/DateValue";
import PropertyField from "../elements/details/PropertyField";
import ToggleIcon from "../elements/icons/ToggleIcon";

const Row = ({log}) => {

    const [showDetails, setShowDetails] = useState(false);

    const handleHide = () => {
        console.log("sss")
        setShowDetails(!showDetails)
    }

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

    return <div className="FlowLogRow">
        <div onClick={handleHide} style={{padding: 10, width: 45,display: "flex", flexDirection: "column", gap: 10}}>
            <Icon type={log.type}/>
            <span><ToggleIcon toggle={showDetails} size={24} /></span>
        </div>
        <div style={{width: "calc(100% - 60px)"}}>
            <PropertyField name="Date" content={<DateValue date={log.metadata.timestamp}/>}></PropertyField>
            {showDetails && <>
                <PropertyField name="Origin" content={log.origin}></PropertyField>
                <PropertyField name="Module" content={log.module}></PropertyField>
                <PropertyField name="Class" content={log.class_name}></PropertyField>
                {log?.flow_id && <PropertyField name="Flow" content={log.flow_id}></PropertyField>}
                {log?.event_id && <PropertyField name="Event" content={log.event_id}></PropertyField>}
                {log?.profile_id && <PropertyField name="Profile" content={log.profile_id}></PropertyField>}
            </>
            }
            <div className='flexLine' style={{padding: 10}}>
                 {log.message}
            </div>
            {showDetails && <>
                <div className="FlowLogDetails">
                    <fieldset style={{width: "100%", margin: 5, padding: 10, paddingBottom: 20}}>
                        <legend>Traceback</legend>
                        <JsonStringify data={{module:log.module, class: log.class_name, traceback: log.traceback}} toggle={true}/>
                    </fieldset>

                </div>
            </>}
        </div>

    </div>
}

const FlowLogs = ({logs, overflow='auto'}) => {

    return <div className="FlowLog">
        <div className="FlowLogHeader">Log Messages</div>
        <div className="FlowLogRows" style={{overflow: overflow}}>
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