import React, {useState} from "react";
import Properties from "../details/DetailProperties";
import Button from "../forms/Button";
import {VscUnlock, VscLock} from "react-icons/vsc";
import {isEmptyObjectOrNull} from '../../../misc/typeChecking';

export default function CredentialsVault({production, test}) {

    const [display, setDisplay] = useState(false);

    const handleReveal = () => {
        setDisplay(!display)
    }

    return <div>
        {display && !isEmptyObjectOrNull(production) &&<div style={{marginBottom: 10}}>
            <p>Credentials that will be used when the workflow is deployed on production.</p><Properties properties={production} />
        </div>}
        {display && !isEmptyObjectOrNull(test) &&<div style={{marginBottom: 10}}>
            <p>Credentials that will be used when the workflow is being debugged and tested.</p><Properties properties={test} />
        </div>}
        {display && (isEmptyObjectOrNull(production) && isEmptyObjectOrNull(test)) && <div style={{marginBottom: 10}}>No credentials were provided for this resource.</div>}
        <div style={{display: "grid", justifyContent: "center"}}>
            <Button  label={!display ? "Reveal" : "Hide"} onClick={handleReveal} style={{padding: "6px 10px", width: "fit-content"}}
                     icon={!display ? <VscUnlock size={20}/> : <VscLock size={20}/>}/>
        </div>
    </div>
}