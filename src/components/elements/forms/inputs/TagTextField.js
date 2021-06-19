import React, {useEffect} from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {request} from "../../../../remote_api/uql_api_endpoint";
import {v4 as uuid4} from 'uuid';
import { useConfirm} from 'material-ui-confirm';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 480,
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
}));

export default function TagTextForm({label, placeholder, defaultTags, tags, onChange, freeSolo=true, multiple=true}) {
    const classes = useStyles();
    const confirm = useConfirm();

    if(!defaultTags) {
        defaultTags = []
    }

    if(!tags) {
        tags = []
    }

    const handleChange = (ev, value, reason) => {
        if (reason === 'create-option') {
            confirm({ title:"Project does not exists!", description: 'Do you want it to be created?' })
                .then(() => {
                    request({
                            url: '/project',
                            method: "post",
                            data: {
                                id: uuid4(),
                                name: value[value.length - 1]
                            }
                        },
                        () => {
                        },
                        () => {
                        },
                        (response) => {
                            console.log("Create-project", response)
                        }
                    )
                })
                .catch(() => {});
        }
        if(onChange) {
            onChange(value)
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



