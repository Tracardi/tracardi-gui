import {VscDebug} from "react-icons/vsc";
import Button from "../forms/Button";
import React, {useState} from "react";
import DataTreeDialog from "../dialog/DataTreeDialog";

export function DebugButton({data}) {
    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }
    return <>
        {jsonData && <DataTreeDialog open={jsonData !== null}
                                     data={jsonData}
                                     onClose={() => setJsonData(null)}/>}
        <Button label="Debug" variant="standard" icon={<VscDebug size={20}/>} onClick={() => handleJsonClick(data)}/>
        </>
}