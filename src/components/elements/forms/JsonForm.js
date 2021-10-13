import React, {useRef, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import MenuItem from "@material-ui/core/MenuItem";
import JsonEditor from "../misc/JsonEditor";
import {isString} from "../../../misc/typeChecking";
import {dot2object, object2dot} from "../../../misc/dottedObject";
import {objectFilter, objectMap} from "../../../misc/mappers";
import ErrorLine from "../../errors/ErrorLine";
import FormSchema from "../../../domain/formSchema";


const JsonForm = ({pluginId, schema, value = {}, onSubmit}) => {

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

        const handleSubmit = (schema) => {
            if (onSubmit) {
                let currentFormValues = formValues.current
                objectMap(currentFormValues, (name, value) => {
                    if (typeof value === 'function') {
                        try {
                            currentFormValues[name] = value()
                        } catch (e) {
                            console.error(e);
                        }
                    }
                })

                const form = new FormSchema(schema)
                form.validate(pluginId, currentFormValues).then(
                    (result) => {
                        if(result === true) {
                            setErrors({})
                            const fieldsToSave = objectFilter(currentFormValues, form.getAllFields());
                            onSubmit(dot2object(fieldsToSave));
                        } else {
                            setErrors(result)
                        }
                    }
                )
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