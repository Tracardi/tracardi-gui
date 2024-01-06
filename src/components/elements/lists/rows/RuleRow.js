import React from 'react';
import { IconButton } from '@mui/material';
import { BsTrash } from 'react-icons/bs';
import Tag from "../../misc/Tag";

const RuleRow = ({data, onDelete=null}) => {

    return (
        <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "20px 10px"}}>
            <div>
                {data.type==='event-collect' && <div style={{fontSize: "110%"}}>Event <Tag backgroundColor="#444" color="white">{data?.event_type?.name}</Tag> from <Tag>{data?.source?.name}</Tag></div>}
                {data.type==='segment-add' && <div style={{fontSize: "110%"}}>Segment <Tag backgroundColor="#444" color="white">{data?.segment?.name}</Tag> added to profile</div>}
                <div style={{marginTop: 10, color:" #666"}}>{data.description}</div>
            </div>
            <div style={{width: 40, alignItems: "center", display: "flex"}}>
                {onDelete instanceof Function &&
                        <IconButton onClick={() => onDelete(data.id, data.name)}>
                            <BsTrash/>
                        </IconButton>
                }
            </div>
        </div>
    );
}

export default RuleRow;
