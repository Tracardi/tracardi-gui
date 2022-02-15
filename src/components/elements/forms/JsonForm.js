import React from "react";
import Button from "./Button";
import {dot2object, object2dot} from "../../../misc/dottedObject";
import AlertBox from "../../errors/AlertBox";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {
    ContentInput,
    CopyTraitsInput,
    DotPathAndTextInput,
    DotPathInput, JsonInput,
    KeyValueInput,
    ListOfDotPaths,
    ResourceSelect, SqlInput, TextAreaInput, TextInput,
    SelectInput, BoolInput, ReadOnlyTags, EventTypes, EventType
} from "./JsonFormComponents";
import ErrorsBox from "../../errors/ErrorsBox";

const getComponentByType = ({value, errorMessage, componentType, fieldId, onChange}) => {

    const handleOnChange = (value, fieldId) => {
        if (onChange) {
            // Converts flat structure to nested object
            onChange(dot2object({[fieldId]: value}))
        }
    }

    switch (componentType) {
        case "readOnlyTags":
            return () => <ReadOnlyTags value={value}/>

        case "eventTypes":
            return (props) => <EventTypes value={value}
                                          onChange={(value) => handleOnChange(value, fieldId)}
                                          {...props}/>
        case "eventType":
            return (props) => <EventType value={value}
                                          onChange={(value) => handleOnChange(value, fieldId)}
                                          {...props}/>
        case "resource":
            return (props) => <ResourceSelect value={value}
                                              errorMessage={errorMessage}
                                              onChange={(value) => handleOnChange(value, fieldId)}
                                              {...props}/>
        case "dotPath":
            return (props) => <DotPathAndTextInput value={value}
                                                   errorMessage={errorMessage}
                                                   onChange={(value) => handleOnChange(value, fieldId)}
                                                   props={props}/>
        case "forceDotPath":
            return (props) => <DotPathInput value={value}
                                            errorMessage={errorMessage}
                                            onChange={(value) => handleOnChange(value, fieldId)}
                                            props={props}/>
        case "keyValueList":
            return (props) => <KeyValueInput value={value}
                                             errorMessage={errorMessage}
                                             onChange={(value) => handleOnChange(value, fieldId)}
                                             props={props}/>
        case "copyTraitsInput":
            return (props) => <CopyTraitsInput value={value}
                                               errorMessage={errorMessage}
                                               onChange={(value) => handleOnChange(value, fieldId)}
                                               props={props}/>

        case "listOfDotPaths":
            return (props) => <ListOfDotPaths
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                props={props}/>

        case "text":
            return (props) => <TextInput value={value}
                                         errorMessage={errorMessage}
                                         onChange={(value) => handleOnChange(value, fieldId)}
                                         {...props}/>

        case "json":
            return (props) => <JsonInput value={value}
                                         errorMessage={errorMessage}
                                         onChange={(value) => handleOnChange(value, fieldId)}
                                         {...props}/>


        case "sql":
            return (props) => <SqlInput value={value}
                                        errorMessage={errorMessage}
                                        onChange={(value) => handleOnChange(value, fieldId)}
                                        {...props}/>
        case "textarea":
            return (props) => <TextAreaInput value={value}
                                             onChange={(value) => handleOnChange(value, fieldId)}
                                             errorMessage={errorMessage}
                                             {...props}/>
        case 'select':
            return (props) => <SelectInput value={value}
                                           onChange={(value) => handleOnChange(value, fieldId)}
                                           errorMessage={errorMessage}
                                           {...props}/>

        case 'bool':
            return (props) => <BoolInput value={value}
                                         onChange={(value) => handleOnChange(value, fieldId)}
                                         errorMessage={errorMessage}
                                         {...props}/>
        case "contentInput":
            return (props) => <ContentInput value={value}
                                            onChange={(value) => handleOnChange(value, fieldId)}
                                            errorMessage={errorMessage}
                                            {...props}/>
        default:
            return () => <AlertBox>Missing form type {componentType}.</AlertBox>
    }
}

const JsonForm = React.memo(({schema, values = {}, errorMessages = {}, serverSideError, onSubmit, onChange, processing = false, confirmed = false}) => {
    const keyValueMapOfComponentValues = object2dot(values)
    const hasErrors = errorMessages && Object.keys(errorMessages).length

    const Title = ({title}) => {
        if (typeof title != 'undefined') {
            return <h1>{title}</h1>
        }
        return ""
    }

    const Fields = ({fields, onChange}) => {

        const readValue = (fieldId) => {
            if (fieldId in keyValueMapOfComponentValues) {
                return keyValueMapOfComponentValues[fieldId]
            } else if (fieldId in values) {
                // This is a hack for ResourceSelect and other components that take objects
                return values[fieldId]
            }

            return null
        }

        const readErrorMessage = (fieldId) => {

            if (errorMessages && fieldId in errorMessages) {
                return errorMessages[fieldId]
            }

            return null
        }

        const FieldsInGroup = ({fields}) => fields.map((fieldObject, key) => {
            const fieldId = fieldObject.id;
            const componentType = fieldObject.component?.type;
            const props = fieldObject.component?.props;
            if (typeof componentType != "undefined") {

                const component = getComponentByType({
                    value: readValue(fieldId),
                    errorMessage: readErrorMessage(fieldId),
                    componentType: componentType,
                    fieldId: fieldId,
                    onChange: onChange
                });

                return <TuiFormGroupField key={fieldId + key}
                                          header={fieldObject.name}
                                          description={fieldObject.description}>
                    {component(props)}&nbsp;
                </TuiFormGroupField>
            } else {
                return ""
            }
        })

        return <TuiFormGroupContent>
            <FieldsInGroup fields={fields}/>
        </TuiFormGroupContent>
    }

    const Groups = ({groups, onChange}) => {

        return groups.map((groupObject, idx) => {
            return <TuiFormGroup key={idx}>
                {(groupObject.name || groupObject.description) && <TuiFormGroupHeader
                    header={groupObject.name}
                    description={groupObject.description}
                />}
                {groupObject.fields && <Fields
                    fields={groupObject.fields}
                    onChange={onChange}
                />}
            </TuiFormGroup>
        })

    }

    const MemoGroups = React.memo(Groups);

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit()
        }
    }

    if (schema) {
        return <TuiForm>
            {schema.title && <Title title={schema.title}/>}

            {schema.groups && <MemoGroups
                groups={schema.groups}
                onChange={onChange}
            />}
            {serverSideError && <ErrorsBox errorList={serverSideError}/>}
            <Button onClick={() => handleSubmit(schema)}
                    confirmed={confirmed}
                    error={hasErrors}
                    progress={processing}
                    label="Save"
                    style={{justifyContent: "center"}}
            />
        </TuiForm>
    }

    return ""

})

export default JsonForm;