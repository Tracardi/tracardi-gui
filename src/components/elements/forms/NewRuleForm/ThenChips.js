import Chip from "@mui/material/Chip";
import React from "react";
import {VscError} from "react-icons/vsc";
import {AiOutlinePlayCircle} from "react-icons/ai";
import ErrorsBox from "../../../errors/ErrorsBox";
import PropTypes from 'prop-types';

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

ThenChips.propTypes = {
    actions: PropTypes.array,
    onDelete: PropTypes.func
}

export default ThenChips;