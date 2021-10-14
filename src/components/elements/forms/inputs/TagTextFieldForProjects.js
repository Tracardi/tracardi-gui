import React, {useEffect, useState} from "react";
import {request} from "../../../../remote_api/uql_api_endpoint";
import TagTextForm from "./TagTextField";
import PropTypes from 'prop-types';

export default function TagTextFieldForProjects({initTags, onChange}) {

    const [tags, setTags] = useState([]);

    const handleChange = (values) => {
        if (onChange) {
            onChange(values)
        }
    }

    useEffect(
        () => {
            request({
                    url: '/projects'
                },
                () => {
                },
                () => {
                },
                (response) => {
                    if (response) {
                        const data = response.data.map((row) => row.name)
                        setTags(data)
                    }
                }
            )
        },
        [])

    return <TagTextForm label="Project tags"
                        onChange={handleChange}
                        defaultTags={initTags}
                        tags={tags}/>
}

TagTextFieldForProjects.propTypes = {
    initTags: PropTypes.array,
    onChange: PropTypes.func   
}