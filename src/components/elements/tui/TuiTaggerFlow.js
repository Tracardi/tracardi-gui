import React, {useEffect, useState} from "react";
import TuiTagger from "./TuiTagger";
import PropTypes from 'prop-types';
import {v4 as uuid4} from "uuid";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote} from "../../../remote_api/entrypoint";

export default function TuiTaggerFlow({tags, onChange}) {

    const [flowTags, setFlowTags] = useState([]);
    const confirm = useConfirm();

    useEffect(
        () => {
            let isSubscribed = true
            asyncRemote({
                url: '/projects'
            }).then((response) => {
                    if (response && isSubscribed) {
                        const data = response.data.map((row) => row.name)
                        setFlowTags(data)
                    }
                }
            ).catch((e) => {
                console.error(e)
            })

            return () => {
                isSubscribed = false
            }
        },
        [])

    const handleChange = (values, reason) => {
        if (reason === 'create-option') {
            confirm({title: "Tag does not exist!", description: 'Do you want it to be created?'})
                .then(async () => {
                    await asyncRemote({
                            url: '/project',
                            method: "post",
                            data: {
                                id: uuid4(),
                                name: values[values.length - 1]
                            }
                        })

                })
                .catch(() => {
                });
        }

        if (onChange) {
            onChange(values)
        }
    }

    return <TuiTagger label="Flow tags"
                      onChange={handleChange}
                      tags={flowTags}/>
}

TuiTaggerFlow.propTypes = {
    initTags: PropTypes.array,
    onChange: PropTypes.func
}