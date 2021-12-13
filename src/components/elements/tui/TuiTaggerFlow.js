import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import TuiTagger from "./TuiTagger";
import PropTypes from 'prop-types';
import {v4 as uuid4} from "uuid";
import {useConfirm} from "material-ui-confirm";

export default function TuiTaggerFlow({tags, onChange}) {

    const [flowTags, setFlowTags] = useState([]);
    const confirm = useConfirm();

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
                        setFlowTags(data)
                    }
                }
            )
        },
        [])

    const handleChange = (values, reason) => {
        if (reason === 'create-option') {
            confirm({ title:"Tag does not exist!", description: 'Do you want it to be created?' })
                .then(() => {
                    request({
                            url: '/project',
                            method: "post",
                            data: {
                                id: uuid4(),
                                name: values[values.length - 1]
                            }
                        },
                        () => {},
                        () => {},
                        () => {}
                    )
                })
                .catch(() => {});
        }

        if (onChange) {
            onChange(values)
        }
    }

    return <TuiTagger label="Flow tags"
                      onChange={handleChange}
                      value={tags}
                      tags={flowTags}/>
}

TuiTaggerFlow.propTypes = {
    initTags: PropTypes.array,
    onChange: PropTypes.func   
}