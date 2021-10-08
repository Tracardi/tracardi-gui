import React, {useCallback, useEffect, useRef, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import MenuItem from "@material-ui/core/MenuItem";
import JsonEditor from "../misc/JsonEditor";
import {isString, isEmptyObject} from "../../../misc/typeChecking";
import {dot2object, object2dot} from "../../../misc/dottedObject";
import {objectFilter, objectMap} from "../../../misc/mappers";









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

    const [errors, setErrors] = useState({})
    const formValues = useRef({...value})   // This must be a copy as it would be treated as reference to plugin.init

    const dottedValues = object2dot(formValues.current)
    console.log("value", formValues)
    console.log("dotted", dottedValues)
    // let formValues = {}

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

    const readValue = (fieldName) => {
        if (fieldName in dottedValues) {
            return dottedValues[fieldName]
        } else if (fieldName in formValues.current) {
            return formValues.current[fieldName]
        }
        return null
    }

    const label2Component = (componentLabel, id) => {
        switch (componentLabel) {
            case "resources":
                return (props) => <ResourceSelect id={id}
                                                  errors={errors}
                                                  {...props}/>
            case "dotPath":
                return (props) => <DotPathInput id={id}
                                                errors={errors}
                                                {...props}/>
            case "text":
                return (props) => <TextInput id={id}
                                             errors={errors}
                                             {...props}/>
            case "json":
                return (props) => <JsonInput id={id}
                                             errors={errors}
                                             {...props}/>
            case "textarea":
                return (props) => <TextAreaInput id={id}
                                                 errors={errors}
                                                 {...props}/>
            default:
                return (props) => ""
        }
    }

    const Fields = ({fields}) => {

        return fields.map((fieldObject, key) => {
            const fieldName = fieldObject.id;
            const component = fieldObject.component?.type;
            const props = fieldObject.component?.props;
            if (typeof component != "undefined") {
                const componentCallable = label2Component(
                    component,
                    fieldName);
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
                {groupObject.fields && <Fields fields={groupObject.fields}/>}
            </section>
        })
    }


    const validate = (schema, values) => {
        if (schema.groups) {
            let validFields = []
            const validationErrors = schema.groups.reduce((accumulator, groupObject) => {
                if (groupObject.fields) {
                    const groupErrors =  groupObject.fields.reduce((previousValue, fieldObject) => {
                        if (fieldObject.validation) {
                            if (fieldObject.id in values) {
                                let re = new RegExp(fieldObject.validation.regex);
                                let fieldValue = values[fieldObject.id]
                                if(!isString(fieldValue)) {
                                    fieldValue = fieldValue.toString()
                                }
                                console.log("re.test.value", fieldValue, typeof fieldValue)
                                console.log("re.test", re.test(fieldValue))
                                if(!re.test(fieldValue)) {
                                    return {...previousValue, [fieldObject.id]: fieldObject.validation.message}
                                } else {
                                    validFields.push(fieldObject.id)
                                }
                            }
                        } else {
                            validFields.push(fieldObject.id)
                        }
                        return null
                    }, {})
                    console.log("accumulator", accumulator)
                    return {...accumulator, ...groupErrors}
                }
                return accumulator;
            }, {})

            if(validationErrors) {
                setErrors(validationErrors)
            }
            return [validationErrors, validFields]
        }
    }

    const handleSubmit = (schema) => {
        if (onSubmit) {
            let currentFormValues = formValues.current
            objectMap(currentFormValues, (name, value) => {
                if (typeof value === 'function') {
                    try {
                        console.log("function", name)
                        currentFormValues[name] = value()
                    } catch (e) {
                        console.log(e)
                    }
                }
            })

            const [validationErrors, validFields] = validate(schema, currentFormValues);
            console.log("validationErrors", validationErrors);
            console.log("validaFields", validFields);
            console.log("currentFormValues", currentFormValues);

            // Convert it back to object
            if(isEmptyObject(validationErrors)) {
                // currentFormValues has all values from all forms
                // We filter only values for current form.
                const fieldsToSave = objectFilter(currentFormValues, validFields);
                onSubmit(dot2object(fieldsToSave));
                console.log("saved", fieldsToSave);
            }

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


    // -------------------------------------------------------
    // Field components
    // -------------------------------------------------------

    function TextInput({id, label, errors = {}}) {

        const [value, setValue] = useState(readValue(id))

        const handleChange = (event) => {
            setValue(event.target.value)
            formValues.current[id] = event.target.value
            event.preventDefault()
        };

        let errorProps = {}
        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <TextField id={id}
                          label={label}
                          value={value}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...errorProps}
        />
    }

    function TextAreaInput({id, label, error}) {

        const [value, setValue] = useState(readValue(id))

        const handleChange = (event) => {
            setValue(event.target.value)
            formValues.current[id] = event.target.value
            event.preventDefault()
        };

        return <TextField id={id}
                          label={label}
                          value={value}
                          onChange={handleChange}
                          error={error}
                          variant="outlined"
                          multiline
                          fullWidth
                          rows={4}
        />
    }

    function DotPathInput({id, label, errors}) {

        const value = readValue(id)
        console.log("dotcomp", value);
        let [sourceValue, pathValue] = isString(value) ? value.split('@') : ["", ""]

        if (typeof pathValue === 'undefined' && sourceValue) {
            pathValue = sourceValue
            sourceValue = ''
        }

        const [path, setPath] = React.useState(pathValue || "");
        const [source, setSource] = React.useState(sourceValue || "");

        console.log("path", path, pathValue)

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

        const handleExternalOnChange = (path, source) => {
            formValues.current[id] = source + "@" + path
        }

        const handlePathChange = (event) => {
            setPath(event.target.value);
            handleExternalOnChange(event.target.value, source);
            event.preventDefault();
        };

        const handleSourceChange = (event) => {
            setSource(event.target.value);
            handleExternalOnChange(path, event.target.value);
            event.preventDefault();
        };

        let errorProps = {}
        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

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
                       variant="outlined"
                       size="small"
                       {...errorProps}
            />
        </div>
    }

    function JsonInput({id, label, error}) {

        const value = readValue(id)
        const jsonString = JSON.stringify(value, null, '  ')
        const [json, setJson] = useState(jsonString);

        const handleExternalOnChange = (value) => {
            formValues.current[id] = value
        }

        const handleChange = (value) => {
            setJson(value);
            handleExternalOnChange(value);
        }

        return <JsonEditor
            value={json}
            onChange={handleChange}
        />
    }
}