import React from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "../elements/forms/AutoComplete";

const label2Component = (label) => {

    switch (label) {
        case "resources":
            return (props) => <ResourceSelect onSelect={(e)=>console.log(e)}/>
        case "text":
            return (props) => <TextField variant="outlined" size="small" {...props}/>
        default:
            return (props) => ""
    }
}

const ResourceSelect = ({onChange, disabled=false, placeholder="Resource"}) => {
    return <AutoComplete disabled={disabled}
                         solo={false}
                         placeholder={placeholder}
                         url="/resources"
                         // initValue={{"id":"", "name": ""}}
                         onSetValue={onChange}
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

export default function Settings() {

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

    const Title = ({title}) => {
        if(typeof title != 'undefined' ) {
            return <h1>{title}</h1>
        }
        return ""
    }

    const Name = ({text}) => {
        if(typeof text != 'undefined' ) {
            return <h2>{text}</h2>
        }
        return ""
    }

    const Description = ({text}) => {
        if(typeof text != 'undefined' ) {
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
                    if(typeof component != "undefined") {
                        const componentCallable = label2Component(component)
                        return <div key={fieldName}>
                            <Name text={fieldDetails.name}/>
                            <Description text={fieldDetails.description}/>
                            {componentCallable(props)}
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

    return <form>
        <Title title={schema.form?.title}/>
        <Groups groups={schema.form?.groups}/>
    </form>

}