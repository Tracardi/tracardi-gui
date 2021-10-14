import React from "react";
import './FilterAddForm.css';
import FilterTextField from "./FilterTextField";
import Button from "../Button";
import PropTypes from 'prop-types';

export default function FilterAddForm({textFieldLabel, buttonLabel, buttonIcon, onFilter, onAdd}) {
    return <div className='FilterAddForm'>
        <div className={!buttonLabel ? "FullGrid" : ""}>
            <FilterTextField label={textFieldLabel} onSubmit={onFilter}/>
            {buttonLabel && <Button label={buttonLabel}
                                    onClick={onAdd}
                                    icon={buttonIcon}
            />}
        </div>
    </div>
}

FilterAddForm.propTypes = {
    textFieldLabel: PropTypes.string,
    buttonIcon: PropTypes.element,
    buttonLabel: PropTypes.string,
    onFilter: PropTypes.func,
    onAdd: PropTypes.func
};