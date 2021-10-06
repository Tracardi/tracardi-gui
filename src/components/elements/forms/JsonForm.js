import React, {useCallback, useEffect} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";


const label2Component = (label, id) => {

    switch (label) {
        case "resources":
            return (props, onChange) => <ResourceSelect id={id} onChange={onChange}/>
        case "text":
            return (props, onChange) => <TextInput id={id} onChange={onChange} {...props}/>
        case "textarea":
            return (props, onChange) => <TextAreaInput id={id} onChange={onChange} {...props}/>
        default:
            return (props, onChange) => ""
    }
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
                      size="small"
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

export default function JsonForm() {

    let formValues = {}

    const objMap = (obj, func) => {
        return Object.entries(obj).map(([k, v]) => func(k, v));
    }

    const schema = {
        form: {
            title: "Form title",
            groups: [
                {
                    "name": "Grupa",
                    "description": "Group description",
                },
                {
                    "name": "Grupa",
                    "description": "Group description",
                    "fields": [
                        {
                            "id": "id1",
                            "component": {
                                "type": "text",
                                "props": {
                                    "label": "source",
                                    "style": {
                                        "margin": 10
                                    },
                                    "required": true,

                                }
                            },
                            "name": "Copy traits to",
                            "description": "Field description",
                            "validation": {
                                "regex": "^[a-zA-Z0–9 ]+$",
                                "message": "Only contain alphanumeric characters allowed"
                            }

                        },
                        {
                            "id": "id2",
                            "component": {
                                "type": "textarea",
                                "props": {
                                    "label": "test",
                                    "style": {
                                        "margin": 10
                                    },
                                    "required": true,
                                    "value": "xxx"
                                }
                            },
                            "name": "Copy traits to",
                            "description": "Field description",
                            "validation": {
                                "regex": "^[a-zA-Z0–9 ]+$",
                                "message": "Only contain alphanumeric characters allowed"
                            }
                        },
                        {
                            "id": "id3",
                            "component": {
                                "type": "resources",
                                "props": {
                                    "required": true,
                                }
                            },
                            "name": "Copy traits from",
                            "description": "Field description",
                            "validation": {
                                "regex": "^[a-zA-Z0–9 ]+$",
                                "message": "Only contain alphanumeric characters allowed"
                            }

                        }
                    ]
                }
            ]
        },

    };

    const onChange = (id, value) => {
        formValues[id] = value
        console.log(formValues)
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

    const Fields = ({fields}) => {

        return fields.map((fieldObject, key) => {
            const fieldName = fieldObject.id
            const component = fieldObject.component?.type
            const props = fieldObject.component?.props
            if (typeof component != "undefined") {
                const componentCallable = label2Component(component, fieldName)
                return <div key={fieldName + key}>
                    <Name text={fieldObject.name} isFirst={key === 0}/>
                    <Description text={fieldObject.description}/>
                    {componentCallable(props, onChange)}
                </div>
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

    const handleSubmit = () => {
        console.log(formValues)
    }

    return <form className="JsonForm">
        <Title title={schema.form?.title}/>
        <Groups groups={schema.form?.groups}/>
        <Button onClick={handleSubmit} label="Submit"/>
    </form>
}