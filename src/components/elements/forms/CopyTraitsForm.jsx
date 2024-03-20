import {MenuItem} from "@mui/material";
import React, {useEffect, useState} from "react";
import "./CopyTraitsForm.css";
import {AiOutlinePlusCircle} from "react-icons/ai";
import TextField from "@mui/material/TextField";
import {VscTrash} from "react-icons/vsc";
import {objectMap} from "../../../misc/mappers";
import DotAccessor from "./inputs/DotAccessor";

const CopyTraitsForm = ({
                            onChange = () => {
                            }, value, actions = {set: "Set"}, defaultAction = "Set", defaultSource="event@", defaultTarget="profile@",
                        }) => {
    const [localValue, setLocalValue] = useState(value || {});
    const [target, setTarget] = useState(defaultTarget);
    const [source, setSource] = useState(defaultSource);
    const [task, setTask] = useState(defaultAction);

    const handleAdd = (e) => {
        if (task !== "" && target !== "" && source !== "") {
            const value = {
                ...localValue,
                [task]: {...localValue[task], [target]: source},
            }
            setLocalValue(value);
            onChange(value);
        }
    };

    const handleDelete = (task, item) => {
        const newCopy = localValue;
        delete newCopy[task][item];
        setLocalValue({...newCopy});
    };

    useEffect(() => {
    }, [localValue]);

    return (
        <div className="CopyTraitsForm">
            <fieldset>
                <legend>Operations</legend>
                <ul className="CopyTraitsList">
                    {Object.keys(localValue).map((task, i) => {
                        return Object.keys(localValue[task]).map((item, j) => {
                            return (
                                <li key={`${task}${j}`}>
                                    <p>{`${item} ${task} to: ${localValue[task][item]}`}</p>
                                    <VscTrash
                                        size={25}
                                        onClick={() => {
                                            handleDelete(task, item);
                                        }}
                                        className="Button DeleteButton"
                                    />
                                </li>
                            );
                        });
                    })}
                </ul>
            </fieldset>
            <div className="CopyTraitsInput">
                <div style={{margin: "5px 0 15px 0", fontSize: "140%"}}>
                    Use this form to add operations.
                </div>
                <DotAccessor label="Target" value={target} onChange={setTarget}/>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingBottom: "10px",
                        paddingTop: "18px",
                    }}
                >
                    <TextField
                        select
                        variant="outlined"
                        size="small"
                        label="Operation"
                        value={task}
                        defaultValue={defaultAction}
                        style={{width: 120, justifySelf: "center"}}
                        onChange={(e) => setTask(e.target.value)}
                    >
                        {objectMap(actions, (key, value) => <MenuItem value={key} key={key}>{value}</MenuItem>)}
                    </TextField>
                </div>
                <div className="Target">
                    <DotAccessor label="Source" value={source} onChange={setSource} defaultSourceValue={defaultSource}/>
                    <AiOutlinePlusCircle size={25} onClick={handleAdd} className="Button AddButton"/>
                </div>
            </div>

        </div>
    );
};

export default CopyTraitsForm;
