import Chip from "@mui/material/Chip";
import React, {useState} from "react";
import FormDrawer from "../drawers/FormDrawer";
import FlowDisplay from "../../flow/FlowDetails";

export default function TuiWorkflowTags({tags, style, size = "medium"}) {

    const [id, setId] = useState(null);

    function Chips() {
        return Array.isArray(tags) && tags.map((tag, index) => <Chip label={tag} key={index} style={style} size={size}
                                                                     onClick={() => setId(tag)}/>)
    }

    return <>
        <Chips/>
        <FormDrawer
            width={800}
            onClose={() => {
                setId(null)
            }}
            open={id !== null}
        >
            {id && <FlowDisplay id={id}/>}
        </FormDrawer>
    </>
}