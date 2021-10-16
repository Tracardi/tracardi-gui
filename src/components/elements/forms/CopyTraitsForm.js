import {MenuItem} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./CopyTraitsForm.css";
import DottedPathInput from "./inputs/DottedPathInput";
import { AiOutlinePlusCircle } from "@react-icons/all-files/ai/AiOutlinePlusCircle";
import TextField from "@material-ui/core/TextField";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";

const CopyTraitsForm = ({ onChange = () => {}, value }) => {
  const [localValue, setLocalValue] = useState(value || { copy: {} });
  const [target, setTarget] = useState("");
  const [source, setSource] = useState("");
  const [task, setTask] = useState("");

  const handleAdd = (e) => {
    setLocalValue({ copy: { ...localValue.copy, [target]: source } });
    onChange(localValue);
  };

  const handleDelete = (key) => {
    const newCopy = localValue.copy;
    delete newCopy[key];
    setLocalValue({ copy: newCopy });
  };

  useEffect(() => {}, [localValue]);

  return (
    <div className="CopyTraitsForm">
      <div className="CopyTraitsInput">
        <DottedPathInput label="path" value={target} onChange={setTarget} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: "20px",
            paddingTop: "20px",
          }}
        >
          <TextField select
            variant="outlined"
            size="small"
            label="Task"
            value={task}
            defaultValue="copy"
            style={{ width: 120, justifySelf: "center" }}
            onChange={(e) => setTask(e.target.value)}
          >
              <MenuItem value="copy">Copy</MenuItem>
              <MenuItem value="append">Append</MenuItem>
              <MenuItem value="remove">Remove</MenuItem>
          </TextField>
        </div>
        <DottedPathInput label="path" value={source} onChange={setSource} />
      </div>
      <AiOutlinePlusCircle size={30} onClick={handleAdd} className="Button AddButton" />

      <fieldset>
          <legend>Operations</legend>
          <ul className="CopyTraitsList">
              {Object.keys(localValue.copy).map((item, i) => {
                  return (
                      <li key={i}>
                          <p>{`${item} ${task} to: ${localValue.copy[item]}`}</p>
                          <VscTrash
                              size={30}
                              onClick={() => {
                                  handleDelete(item);
                              }}
                              className="Button DeleteButton"
                          />
                      </li>
                  );
              })}
          </ul>
      </fieldset>
    </div>
  );
};

export default CopyTraitsForm;
