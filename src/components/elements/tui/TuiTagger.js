import React, {useState} from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function TuiTagger({label, placeholder, tags, onChange, freeSolo = true, multiple = true}) {

    if (typeof tags === 'undefined' || !tags) {
        tags = []
    }

    // eslint-disable-next-line
    const [defaultValues, setDefaultValues] = useState([...tags])

    const handleChange = (ev, value, reason) => {
        if (onChange) {
            onChange(value, reason)
        }
    }

    return (<Autocomplete
            multiple={multiple}
            freeSolo={freeSolo}
            size="small"
            onChange={(ev, value, reason) => {
                handleChange(ev, value, reason)
            }}
            options={tags}
            defaultValue={defaultValues}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip size="small" label={option} {...getTagProps({index})} />
                ))
            }
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label={label} placeholder={placeholder}/>
            )}
        />
    );
}

TuiTagger.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    tags: PropTypes.array,
    freeSolo: PropTypes.bool,
    multiple: PropTypes.bool,
}



