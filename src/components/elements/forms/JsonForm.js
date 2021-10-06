import React from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";


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

    const [inputValue, setInputValue] = React.useState(value);

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
        />
}

function TextAreaInput({id, onChange, label, value, error}) {
    const [inputValue, setInputValue] = React.useState(value);

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
                      rows={4}
    />
}

const ResourceSelect = ({id, onChange, value, disabled = false, placeholder = "Resource"}) => {

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, event.target.value);
        }
    };

    return <AutoComplete disabled={disabled}
                         solo={false}
                         placeholder={placeholder}
                         url="/resources"
        // initValue={{"id":"", "name": ""}}
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
            groups: {
                "group1": {
                    "description": "Group description",
                    "fields": [
                        {
                            "copy.traits.to": {
                                "component": {
                                    "type": "text",
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
                            }
                        },
                        {
                            "copy.aaa.to": {
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
                            }
                        },
                        {
                            "copy.traits.from": {
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
                        }
                    ]
                }
            }
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

    const Name = ({text}) => {
        if (typeof text != 'undefined') {
            return <h2>{text}</h2>
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

        const Fld = ({fields}) => {
            return fields.map((fieldSchema, key) => {
                return objMap(fieldSchema, (fieldName, fieldDetails) => {
                    const component = fieldDetails?.component?.type
                    const props = fieldDetails?.component?.props
                    if (typeof component != "undefined") {
                        const componentCallable = label2Component(component, fieldName)
                        return <div key={fieldName}>
                            <Name text={fieldDetails.name}/>
                            <Description text={fieldDetails.description}/>
                            {componentCallable(props, onChange)}
                        </div>
                    }
                })[0]
            })
        }

        return <Fld fields={fields.fields}/>
    }

    const Groups = ({groups}) => {

        return objMap(groups, (groupName, fields) => {
            return <section key={groupName}>
                {groupName}
                <Description text={fields.description}/>
                <Fields fields={fields}/>
            </section>
        })
    }

    const handleSubmit = () => {
        console.log(formValues)
    }

    return <form>
        <Title title={schema.form?.title}/>
        <Groups groups={schema.form?.groups}/>
        <Button onClick={handleSubmit} label="Submit"/>
    </form>
}