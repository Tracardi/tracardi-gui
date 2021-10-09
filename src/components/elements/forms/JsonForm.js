import React, {useRef, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import MenuItem from "@material-ui/core/MenuItem";
import JsonEditor from "../misc/JsonEditor";
import {isString, isEmptyObject} from "../../../misc/typeChecking";
import {dot2object, object2dot} from "../../../misc/dottedObject";
import {objectFilter, objectMap} from "../../../misc/mappers";
import ErrorLine from "../../errors/ErrorLine";


const JsonForm = ({schema, value = {}, onSubmit}) => {

    const formValues = useRef({})

    // Rewrite formValues on every new JsonForm
    formValues.current = {...value} // This must be a copy as it would be treated as reference to plugin.init

    const dottedValues = object2dot(formValues.current)

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

    const Fields = ({fields, componetsDb}) => {

        return fields.map((fieldObject, key) => {
            const fieldName = fieldObject.id;
            const component = fieldObject.component?.type;
            const props = fieldObject.component?.props;
            if (typeof component != "undefined") {
                const componentSchema = componetsDb(
                    component,
                    fieldName);
                return <div key={fieldName + key}>
                    <Name text={fieldObject.name} isFirst={key === 0}/>
                    <Description text={fieldObject.description}/>
                    {componentSchema.component(props)}
                </div>
            } else {
                return ""
            }
        })
    }

    const Groups = ({groups}) => {

        const [errors, setErrors] = useState({})

        const getComponentByLabel = (componentLabel, id) => {
            switch (componentLabel) {
                case "resource":
                    return {
                        component: (props) => <ResourceSelect id={id}
                                                              errors={errors}
                                                              {...props}/>
                    }
                case "dotPath":
                    return {
                        component: (props) => <DotPathInput id={id}
                                                            errors={errors}
                                                            {...props}/>
                    }
                case "text":
                    return {
                        component: (props) => <TextInput id={id}
                                                         errors={errors}
                                                         {...props}/>
                    }
                case "json":
                    return {
                        component: (props) => <JsonInput id={id}
                                                         errors={errors}
                                                         {...props}/>,
                        validator: (value) => {
                            try {
                                JSON.parse(value);
                                return true;
                            } catch (e) {
                                return e.toString()
                            }

                        }

                    }
                case "textarea":
                    return {
                        component: (props) => <TextAreaInput id={id}
                                                             errors={errors}
                                                             {...props}/>
                    }
                default:
                    return {
                        component: (props) => ""
                    }
            }
        }

        const validate = (schema, values) => {
            if (schema.groups) {
                let validFields = []
                const validationErrors = schema.groups.reduce((accumulator, groupObject) => {
                    if (groupObject.fields) {
                        const groupErrors = groupObject.fields.reduce((previousValue, fieldObject) => {
                            // console.log('required', fieldObject.required, fieldObject.id)
                            // console.log('val',values[fieldObject.id], fieldObject.id  in values)
                            // console.log("component", fieldObject.component.type)
                            if(fieldObject.required && fieldObject.required === true) {
                                let value = null;
                                if(fieldObject.component?.type === 'resource') {
                                    // console.log('fff')
                                    if(fieldObject.id  in values) {
                                        value = values[fieldObject.id].id
                                    }
                                } else {
                                    value = values[fieldObject.id]
                                }
                                // console.log("ddd", value)
                                // console.log(!(fieldObject.id  in values))
                                // console.log(values[fieldObject.id], typeof values[fieldObject.id] === 'undefined')
                                // console.log(values[fieldObject.id] === "")
                                if(!(fieldObject.id  in values)
                                    || value === null
                                    || typeof value === 'undefined'
                                    || value === "") {
                                    return {...previousValue, [fieldObject.id]: "This field is required."}
                                }
                            }

                            if (fieldObject.validation) {
                                if (fieldObject.id in values) {
                                    let re = new RegExp(fieldObject.validation.regex);
                                    let fieldValue = values[fieldObject.id]
                                    if (!isString(fieldValue)) {
                                        fieldValue = fieldValue.toString()
                                    }
                                    if (!re.test(fieldValue)) {
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
                        return {...accumulator, ...groupErrors}
                    }
                    return accumulator;
                }, {})

                if (validationErrors) {
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
                            currentFormValues[name] = value()
                        } catch (e) {
                            console.log(e)
                        }
                    }
                })

                const [validationErrors, validFields] = validate(schema, currentFormValues);

                // Convert it back to object
                if (isEmptyObject(validationErrors)) {
                    // currentFormValues has all values from all forms
                    // We filter only values for current form.
                    const fieldsToSave = objectFilter(currentFormValues, validFields);
                    onSubmit(dot2object(fieldsToSave));
                }

            }
        }

        const groupComponents = groups.map((groupObject, idx) => {
            return <section key={idx}>
                {groupObject.name && <h2>{groupObject.name}</h2>}
                {groupObject.description && <Description text={groupObject.description}/>}
                {groupObject.fields && <Fields
                    fields={groupObject.fields}
                    componetsDb={getComponentByLabel}
                />}
            </section>
        })

        return <>
            {groupComponents}
            <Button onClick={() => handleSubmit(schema)} label="Submit"/>
        </>
    }

    if (schema) {
        return <form className="JsonForm">
            {schema.title && <Title title={schema.title}/>}
            {schema.groups && <Groups groups={schema.groups}/>}
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

    function TextAreaInput({id, label, errors}) {

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
                          multiline
                          fullWidth
                          rows={4}
                          {...errorProps}
        />
    }

    function DotPathInput({id, label, errors}) {

        const value = readValue(id)
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
                       style={{width: 120, marginRight: 5}}
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
                       style={{width: 460}}
                       {...errorProps}
            />
        </div>
    }

    function JsonInput({id, label, error}) {

        const value = readValue(id)
        const jsonString = JSON.stringify(value, null, '  ')
        const [json, setJson] = useState(jsonString);

        const handleExternalOnChange = (value) => {
            formValues.current[id] = () => {
                try {
                    return JSON.parse(value)
                } catch (e) {
                    return e.toString();
                }
            }
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

    function ResourceSelect({id, label, errors, placeholder = "Resource"}) {

        const value = readValue(id)

        const handleChange = (value) => {
            formValues.current[id] = value
        };

        const Error = () => {
            if (id in errors) {
                return <ErrorLine>{errors[id]}</ErrorLine>
            }
            return ""
        }

        return <>
            <AutoComplete disabled={false}
                          solo={false}
                          placeholder={placeholder}
                          url="/resources"
                          initValue={value}
                          onSetValue={handleChange}
                          onDataLoaded={
                              (result) => {
                                  if (result) {
                                      let sources = [{id: "", name: ""}]
                                      for (const source of result?.data?.result) {
                                          if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                              sources.push({name: source.name, id: source.id})
                                          }
                                      }
                                      return sources
                                  }
                              }
                          }/>
                          <Error/>
        </>
    }
}

const MemoJsonForm = React.memo(JsonForm);

export default MemoJsonForm;