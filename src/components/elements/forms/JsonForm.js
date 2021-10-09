import React, {useCallback, useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import MenuItem from "@material-ui/core/MenuItem";
import JsonEditor from "../misc/JsonEditor";
import isString from "../../../misc/isString";
import {dot2object, object2dot} from "../../../misc/dottedObject";

const label2Component = (componentLabel, id, fieldValue, onChange) => {
    switch (componentLabel) {
        case "resources":
            return (props) => <ResourceSelect id={id} value={fieldValue} onChange={onChange}/>
        case "dotPath":
            return (props) => <DotPathInput id={id} value={fieldValue} onChange={onChange} {...props}/>
        case "text":
            return (props) => <TextInput id={id} value={fieldValue} onChange={onChange} {...props}/>
        case "json":
            return (props) => <JsonInput id={id} value={fieldValue} onChange={onChange} {...props}/>
        case "number":
            return (props) => <NumberInput id={id} value={fieldValue} onChange={onChange} {...props}/>
        case "textarea":
            return (props) => <TextAreaInput id={id} value={fieldValue} onChange={onChange} {...props}/>
        default:
            return (props) => ""
    }
}

function JsonInput({id, onChange, label, value, error}) {

    const jsonString = JSON.stringify(value, null, '  ')
    const [json, setJson] = useState(jsonString);

    const handleChange = (value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, () => {return JSON.parse(value)});
        }
        setJson(value);
    }

    return <JsonEditor
        value={json}
        onChange={handleChange}
    />
}

function DotPathInput({id, onChange, label, value, error}) {
    let [sourceValue, pathValue] = isString(value) ? value.split('@') : ["", ""]
    if (typeof pathValue === 'undefined' && sourceValue) {
        pathValue = sourceValue
        sourceValue = ''
    }

    const [path, setPath] = React.useState(pathValue || "");
    const [source, setSource] = React.useState(sourceValue || "");

    const sources = [
        {
            value: '',
            label: '',
        },
        {
            value: 'payload',
            label: 'payload',
        },
        {
            value: 'profile',
            label: 'profile',
        },
        {
            value: 'event',
            label: 'event',
        },
        {
            value: 'session',
            label: 'session',
        },
        {
            value: 'flow',
            label: 'flow',
        },
    ];

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleExternalOnChange = (path, source) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, source + "@" + path);
        }
    }

    const handlePathChange = (event) => {
        setPath(event.target.value);
        handleExternalOnChange(event.target.value, source);
    };

    const handleSourceChange = (event) => {
        setSource(event.target.value);
        handleExternalOnChange(path, event.target.value);
    };

    return <div style={{display: "flex"}}>
        <TextField select
                   label="Source"
                   variant="outlined"
                   size="small"
                   value={source}
                   onChange={handleSourceChange}
                   style={{width: 100, marginRight: 5}}
        >
            {sources.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
        <TextField id={id}
                   label={label}
                   value={path}
                   onChange={handlePathChange}
                   error={error}
                   variant="outlined"
                   size="small"
        />
    </div>
}

function TextInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, event.target.value);
        }
        setInputValue(event.target.value);
    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      size="small"
                      fullWidth
    />
}

function NumberInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        try {
            let value = ""
            if (event.target.value) {
                value = parseInt(event.target.value)
                if (!isNaN(value)) {
                    if (typeof onChange != "undefined") {
                        onChange(id, value);
                    }
                    setInputValue(value);
                }
            }
        } catch (e) {
            console.log(e)
        }
    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      size="small"
                      inputProps={{inputMode: "numeric", pattern: '[0-9]*'}}
                      fullWidth
    />
}

function TextAreaInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, event.target.value);
            event.preventDefault();
        }
        setInputValue(event.target.value);
    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      multiline
                      fullWidth
                      rows={4}
    />
}

const ResourceSelect = ({id, onChange, value, disabled = false, placeholder = "Resource"}) => {

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            if (event !== null) {
                onChange(id, event.id);
            }
        }
    };

    return <AutoComplete disabled={disabled}
                         solo={false}
                         placeholder={placeholder}
                         url="/resources"
                         initValue={{"id": "", "name": ""}}
                         onSetValue={handleChange}
                         onDataLoaded={
                             (result) => {
                                 if (result) {
                                     let sources = []
                                     for (const source of result?.data?.result) {
                                         if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                             sources.push({name: source.name, id: source.id})
                                         }
                                     }
                                     return sources
                                 }
                             }
                         }/>

}

export default function JsonForm({schema, value = {}, onSubmit}) {

    let formValues = {}

    const objMap = (obj, func) => {
        return Object.entries(obj).map(([k, v]) => func(k, v));
    }

    const onChange = (id, value) => {
        formValues[id] = value
    }

    const Title = ({title}) => {
        if (typeof title != 'undefined') {
            return <h1>{title}</h1>
        }
        return ""
    }

    const Name = ({text, isFirst = false}) => {
        if (typeof text != 'undefined') {
            if (isFirst === true) {
                return <h3 style={{marginTop: 0}}>{text}</h3>
            }
            return <h3>{text}</h3>
        }
        return ""
    }

    const Description = ({text}) => {
        if (typeof text != 'undefined') {
            return <p>{text}</p>
        }
        return ""
    }

    const readValue = (fieldName, dottedValues, value) => {
        if(fieldName in dottedValues) {
            return dottedValues[fieldName]
        } else if(fieldName in value) {
            return value[fieldName]
        }
        return null
    }

    const Fields = ({fields, value}) => {
        // Convert to dotted values
        const dottedValues = object2dot(value)

        return  fields.map((fieldObject, key) => {
            const fieldName = fieldObject.id;
            const component = fieldObject.component?.type;
            const props = fieldObject.component?.props;
            const fieldValue = readValue(fieldName, dottedValues, value);
            if (typeof component != "undefined") {
                const componentCallable = label2Component(
                    component,
                    fieldName,
                    fieldValue,
                    onChange);
                return <div key={fieldName + key}>
                    <Name text={fieldObject.name} isFirst={key === 0}/>
                    <Description text={fieldObject.description}/>
                    {componentCallable(props)}
                </div>
            } else {
                return ""
            }
        })
    }

    const Groups = ({groups}) => {

        return groups.map((groupObject, idx) => {
            return <section key={idx}>
                {groupObject.name && <h2>{groupObject.name}</h2>}
                {groupObject.description && <Description text={groupObject.description}/>}
                {groupObject.fields && <Fields fields={groupObject.fields} value={value}/>}
            </section>
        })
    }


    const validate = (schema, values) => {
        if(schema.groups) {
            schema.groups.map((groupObject) => {
                if(groupObject.fields) {
                    return groupObject.fields.map((fieldObject) => {
                        console.log(fieldObject)
                        if(fieldObject.validation) {
                            if(fieldObject.id in values) {
                                let re = new RegExp(fieldObject.validation.regex);
                                const v = values[fieldObject.id]
                                console.log('xxx', fieldObject.validation, v, re.test(v))
                            }
                        }
                        return null
                    })
                }
                return null;
            })
        }
    }


    const handleSubmit = (schema) => {
        // todo validate

        if (onSubmit) {
            objMap(formValues, (name, value) => {
                if (typeof value === 'function') {
                    try {
                        formValues[name] = value()
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            validate(schema, formValues)

            // Convert it back to object
            onSubmit(dot2object(formValues))
        }
    }

    if (schema) {
        return <form className="JsonForm">
            {schema.title && <Title title={schema.title}/>}
            {schema.groups && <Groups groups={schema.groups}/>}
            <Button onClick={() => handleSubmit(schema)} label="Submit"/>
        </form>
    }

    return ""

}