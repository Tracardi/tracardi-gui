import Chip from "@material-ui/core/Chip";
import React from "react";
import {VscError} from "@react-icons/all-files/vsc/VscError";
import {AiOutlinePlayCircle} from "@react-icons/all-files/ai/AiOutlinePlayCircle";
import ErrorsBox from "../../../errors/ErrorsBox";

function ThenChips({actions, onDelete}) {

    const onChipDelete = (id) => {
        return () => {
            onDelete(id);
        }
    }

    const render = () => {
        if(Array.isArray(actions)) {
            if (actions.length === 0) {
                return <Chip
                    icon={<VscError size={24} color={"#d81b60"}/>}
                    label="No actions yet"
                    style={{color: "#d81b60", border: "solid #d81b60 2px", backgroundColor: "inherit"}}/>
            }

            let props = {
                icon: <AiOutlinePlayCircle size={24} color={"#0069c0"}/>,
                style: {color: "#0069c0", border: "solid #0069c0 2px", backgroundColor: "inherit"}
            }

            return actions.map((signature, index) => {

                    if (onDelete) {
                        props = {...props, onDelete:onChipDelete(index)}
                    }

                    return <Chip
                        key={index}
                        label={signature}
                        {...props}
                    />
                }
            );
        } else {
            return <ErrorsBox errorList={[{msg: "Artions is not array", type: "Exception"}]}/>
        }
    }

    return render();

}

export default ThenChips;