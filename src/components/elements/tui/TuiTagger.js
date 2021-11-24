import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 480,
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
}));

export default function TuiTagger({label, placeholder, defaultTags, tags, onChange, freeSolo=true, multiple=true}) {
    const classes = useStyles();

    if(!defaultTags) {
        defaultTags = []
    }

    if(!tags) {
        tags = []
    }

    const handleChange = (ev, value, reason) => {
        if(onChange) {
            onChange(value, reason)
        }
    }

    return (
        <div className={classes.root}>
                <Autocomplete
                    multiple={multiple}
                    freeSolo={freeSolo}
                    id="tags-text"
                    size="small"
                    onChange={(ev, value, reason) =>
                    { handleChange (ev, value, reason)} }
                    options={tags}
                    defaultValue={defaultTags}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip size="small" label={option} {...getTagProps({index})} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} variant="outlined" label={label} placeholder={placeholder}/>
                    )}
                />
        </div>
    );
}

TuiTagger.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    defaultTags: PropTypes.array,
    tags: PropTypes.array,
    freeSolo: PropTypes.bool,
    multiple: PropTypes.bool,
}



