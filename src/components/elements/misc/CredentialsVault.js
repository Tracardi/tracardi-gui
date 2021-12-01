import React, {useState} from "react";
import Properties from "../details/DetailProperties";
import Button from "../forms/Button";
import {VscUnlock} from "@react-icons/all-files/vsc/VscUnlock";
import {VscLock} from "@react-icons/all-files/vsc/VscLock";
import {isEmptyObjectOrNull} from '../../../misc/typeChecking';

export default function CredentialsVault({data}) {

    const [display, setDisplay] = useState(false);

    const handleReveal = () => {
        setDisplay(!display)
    }

    return <div>
        {display && !isEmptyObjectOrNull(data) &&<div style={{marginBottom: 10}}><Properties properties={data} /></div>}
        {display && isEmptyObjectOrNull(data) && <div style={{marginBottom: 10}}>No credentials were provided for this resource.</div>}
        <div style={{display: "grid", justifyContent: "center"}}>
            <Button  label={!display ? "Reveal" : "Hide"} onClick={handleReveal} style={{padding: "6px 10px", width: "fit-content"}}
                     icon={!display ? <VscUnlock size={20}/> : <VscLock size={20}/>}/>
        </div>
    </div>
}