import React, {useCallback, useEffect, useState} from "react";
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
    SelectInput, BoolInput, ReadOnlyTags, EventTypes, EventType, ConsentTypes, AutoCompleteInput
} from "./JsonFormComponents";
import ErrorsBox from "../../errors/ErrorsBox";
import {AiOutlineCheckCircle} from "react-icons/ai";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";

const getComponentByType = ({value, values, errorMessage, componentType, fieldId, onChange}) => {

    const handleOnChange = (value, fieldId, deleted = {}) => {
        if (onChange instanceof Function) {
            // Converts flat structure to nested object
            onChange(dot2object({[fieldId]: value}), Object.keys(deleted).length > 0 ? dot2object({[fieldId]: deleted}) : {})
        }
    }

    switch (componentType) {

        case "autocomplete":
            return (props) => <AutoCompleteInput
                value={value}
                values={values}
                error={errorMessage}
                onSetValue={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "readOnlyTags":
            return () => <ReadOnlyTags
                value={value}/>

        case "eventTypes":
            return (props) => <EventTypes
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "consentTypes":
            return (props) => <ConsentTypes
                value={value}
                onChange={value => handleOnChange(value, fieldId)}
                {...props}/>

        case "eventType":
            return (props) => <EventType
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "resource":
            return (props) => <ResourceSelect
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "dotPath":
            return (props) => <DotPathAndTextInput
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                props={props}/>

        case "forceDotPath":
            return (props) => <DotPathInput
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                props={props}/>

        case "keyValueList":
            return (props) => <KeyValueInput
                value={value}
                values={values}
                errorMessage={errorMessage}
                onChange={(value, deleted) => handleOnChange(value, fieldId, deleted)}
                props={props}/>

        case "copyTraitsInput":
            return (props) => <CopyTraitsInput
                value={value}
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
            return (props) => <TextInput
                value={value}
                errorMessage={errorMessage}
                onChange={useCallback((value) => handleOnChange(value, fieldId), [])}
                {...props}/>

        case "json":
            return (props) => <JsonInput
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>


        case "sql":
            return (props) => <SqlInput
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "textarea":
            return (props) => <TextAreaInput
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                {...props}/>

        case 'select':
            return (props) => <SelectInput
                value={value}
                values={values}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                {...props}/>

        case 'bool':
            return (props) => <BoolInput
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                {...props}/>

        case "contentInput":
            return (props) => <ContentInput
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                {...props}/>

        default:
            return () => <AlertBox>Missing form type {componentType}.</AlertBox>
    }
}

const Fields = ({fields, values, errorMessages, keyValueMapOfComponentValues, onChange}) => {

    const FieldsInGroup = ({fields}) => fields.map((fieldObject, key) => {
        const fieldId = fieldObject.id;
        const componentType = fieldObject.component?.type;
        const props = fieldObject.component?.props;

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

        if (typeof componentType != "undefined") {

            const component = getComponentByType({
                value: readValue(fieldId),
                values: values,
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

const Groups = ({groups, values, onChange, errorMessages, keyValueMapOfComponentValues}) => {
    return groups.map((groupObject, idx) => {
        return <TuiFormGroup key={idx}>
            {(groupObject.name || groupObject.description) && <TuiFormGroupHeader
                header={groupObject.name}
                description={groupObject.description}
            />}
            {groupObject.fields && <Fields
                fields={groupObject.fields}
                onChange={onChange}
                errorMessages={errorMessages}
                values={values}
                keyValueMapOfComponentValues={keyValueMapOfComponentValues}
            />}
        </TuiFormGroup>
    })
}

const Title = ({title}) => {
    if (typeof title != 'undefined') {
        return <h1>{title}</h1>
    }
    return ""
}

const JsonForm = ({schema, values = {}, errorMessages = {}, serverSideError, onSubmit, onChange, processing = false, confirmed = false}) => {

    const [keyValueMapOfComponentValues, setValueMap] = useState({})
    const hasErrors = errorMessages && Object.keys(errorMessages).length
    const [data, setData] = useState({})

    useEffect(()=>{
        setData(values);
        setValueMap(object2dot(values))
    }, [values])

    const handleSubmit = () => {
        if (onSubmit instanceof Function) {
            onSubmit(data)
        }
    }

    const handleChange = (changed, deleted) => {
        const merged = MutableMergeRecursive(data, changed, deleted)
        if (onChange instanceof Function) {
            onChange(merged)
        }
    }

    if (schema) {
        return <TuiForm>
            {schema.title && <Title title={schema.title}/>}

            {schema.groups && <Groups
                groups={schema.groups}
                onChange={handleChange}
                values={data}
                errorMessages={errorMessages}
                keyValueMapOfComponentValues={keyValueMapOfComponentValues}
            />}

            {serverSideError && <ErrorsBox errorList={serverSideError}/>}

            <Button onClick={() => handleSubmit()}
                    confirmed={confirmed}
                    error={hasErrors}
                    progress={processing}
                    label="Save"
                    icon={<AiOutlineCheckCircle size={20}/>}
                    style={{justifyContent: "center"}}
            />
        </TuiForm>
    }

    return ""

}

export default JsonForm;