import React from "react";
import './FilterAddForm.css';
import FilterTextField from "./FilterTextField";
import Button from "../Button";

export default function FilterAddForm({textFieldLabel, buttonLabel, buttonIcon, onFilter, onAdd}) {
    return <div className='FilterAddForm'>
        <div>
            <FilterTextField label={textFieldLabel} onSubmit={onFilter}/>
            {buttonLabel && <Button label={buttonLabel}
                                    onClick={onAdd}
                                    icon={buttonIcon}
            />}
        </div>
    </div>
}