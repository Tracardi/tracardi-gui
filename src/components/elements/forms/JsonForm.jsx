import React, {memo, useCallback} from "react";
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
    SelectInput, BoolInput, ReadOnlyTags, EventTypes, EventType, ConsentTypes, AutoCompleteInput,
    ReportConfig, PasswordInput, FontSizeInput, RefTextInput, SourceTypeSelect, SourceSelect
} from "./JsonFormComponents";
import ErrorsBox from "../../errors/ErrorsBox";
import {AiOutlineCheckCircle} from "react-icons/ai";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import {isEmptyStringOrNull, isObject} from "../../../misc/typeChecking";
import {changeReferences, searchRecursivelyInValues} from "../../../misc/mappers";
import TuiColorPicker from "../tui/TuiColorPicker";
import TuiBoxStyling from "../tui/TuiBoxStyling";

const getComponentByType = ({value, values, errorMessage, componentType, fieldId, onChange}) => {

    const handleOnChange = (value, fieldId, deleted = {}) => {
        if (onChange instanceof Function) {
            // Converts flat structure to nested object
            onChange(
                (fieldId !== '*')
                    ? dot2object({[fieldId]: value})
                    : dot2object(value)
                , Object.keys(deleted).length > 0
                    ? dot2object({[fieldId]: deleted})
                    : {})
        }
    }

    switch (componentType) {

        case "autocomplete":
            return (props) => <AutoCompleteInput
                value={value}
                values={values}
                error={errorMessage}
                onSetValue={(value) => handleOnChange(value, fieldId)}
                onChange={value => handleOnChange(value, fieldId)}
                {...props}/>

        case "readOnlyTags":
            return () => <ReadOnlyTags
                value={value}/>

        case "colorPicker":
            return (props) => <TuiColorPicker
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}
            />

        case "boxStyling":
            return (props) => <TuiBoxStyling
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}
            />

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
                errorMessage={errorMessage}
                {...props}/>

        case "resource":
            return (props) => <ResourceSelect
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "sourceType":
            return (props) => <SourceTypeSelect
                value={value}
                errorMessage={errorMessage}
                onChange={(value) => handleOnChange(value, fieldId)}
                {...props}/>

        case "source":
            return (props) => <SourceSelect
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

        case "refTextInput":
            return (props) => <RefTextInput
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

        case "password":
            return (props) => <PasswordInput
                value={value}
                error={!isEmptyStringOrNull(errorMessage)}
                helperText={errorMessage}
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

        case "reportConfig":
            return (props) => <ReportConfig
                value={value}
                onChange={(value) => handleOnChange(value, fieldId)}
                errorMessage={errorMessage}
                {...props}
            />

        case "fontSize":
            return (props) => <FontSizeInput
                value={value}
                errorMessage={errorMessage}
                onChange={useCallback((value) => handleOnChange(value, fieldId), [])}
                {...props}/>

        default:
            return () => <AlertBox>Missing form type {componentType}.</AlertBox>
    }
}

const Fields = ({spec, fields, values, errorMessages, keyValueMapOfComponentValues, onChange}) => {

    const FieldsInGroup = ({fields}) => fields.map((fieldObject, key) => {
        const fieldId = fieldObject.id;
        const componentType = fieldObject.component?.type;
        let props = fieldObject.component?.props;

        // Resolve props references

        if (spec !== null && isObject(spec)) {
            props = changeReferences(props, spec)
        }

        const readValue = (fieldId) => {
            if (fieldId === '*') {
                return dot2object(keyValueMapOfComponentValues)
            } else if (fieldId in keyValueMapOfComponentValues) {
                // This handles simple fields like nums, strings
                return keyValueMapOfComponentValues[fieldId]
            } else {
                // This handles fields that are subtrees of config object
                return searchRecursivelyInValues(fieldId.split("."), values);
            }
        }

        const readErrorMessage = (componentType, fieldId) => {

            if (errorMessages && fieldId in errorMessages) {
                return errorMessages[fieldId]
            }

            if (componentType === 'resource') {
                const nestedFieldId = `${fieldId}.id`
                if (errorMessages && nestedFieldId in errorMessages) {
                    return errorMessages[nestedFieldId]
                }
            }

            return null
        }

        if (typeof componentType != "undefined") {

            const component = getComponentByType({
                value: readValue(fieldId),
                values: values,
                errorMessage: readErrorMessage(componentType, fieldId),
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

const Groups = ({spec, groups, values, onChange, errorMessages, keyValueMapOfComponentValues}) => {
    return groups.map((groupObject, idx) => {
        return <TuiFormGroup key={idx}>
            {(groupObject.name || groupObject.description) && <TuiFormGroupHeader
                header={groupObject.name}
                description={groupObject.description}
            />}
            {groupObject.fields && <Fields
                spec={spec}
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

const JsonForm = ({spec = null, schema, values = {}, errorMessages = {}, serverSideError, onSubmit, onChange, processing = false, confirmed = false}) => {

    const keyValueMapOfComponentValues = object2dot(values)
    const hasErrors = errorMessages && Object.keys(errorMessages).length

    const handleSubmit = () => {
        if (onSubmit instanceof Function) {
            onSubmit(values)
        }
    }

    const handleChange = (changed, deleted) => {
        const merged = MutableMergeRecursive(values, changed, deleted)
        if (onChange instanceof Function) {
            onChange(merged)
        }
    }

    if (schema) {
        return <TuiForm>
            {schema.title && <Title title={schema.title}/>}

            {schema.groups && <Groups
                spec={spec}
                groups={schema.groups}
                onChange={handleChange}
                values={values}
                errorMessages={errorMessages}
                keyValueMapOfComponentValues={keyValueMapOfComponentValues}
            />}

            {serverSideError && <ErrorsBox errorList={serverSideError}/>}

            {onSubmit && <Button onClick={() => handleSubmit()}
                                 confirmed={confirmed}
                                 error={hasErrors}
                                 progress={processing}
                                 label="Save"
                                 icon={<AiOutlineCheckCircle size={20}/>}
                                 style={{justifyContent: "center"}}
            />}
        </TuiForm>
    }

    return ""

}
export const JsonFormMemo = memo(JsonForm, ()=> true)
export default JsonForm;
