import React, {useRef, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import JsonEditor from "../editors/JsonEditor";
import {dot2object, object2dot} from "../../../misc/dottedObject";
import {objectMap} from "../../../misc/mappers";
import ErrorLine from "../../errors/ErrorLine";
import FormSchema from "../../../domain/formSchema";
import DottedPathInput from "./inputs/DottedPathInput";
import ListOfDottedInputs from "./ListOfDottedInputs";
import AlertBox from "../../errors/AlertBox";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Tabs, {TabCase} from "../tabs/Tabs";
import HtmlEditor from "../editors/HtmlEditor";
import SqlEditor from "../editors/SqlEditor";
import KeyValueForm from "./KeyValueForm";


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
        const [submitConfirmed, setSubmitConfirmed] = useState(false);
        const [submitError, setSubmitError] = useState(false);

        const handleOnChange = (value) => {
            setSubmitConfirmed(false);
            setSubmitError(false);
        }

        const getComponentByLabel = (componentLabel, id) => {
            switch (componentLabel) {
                case "resource":
                    return {
                        component: (props) => <ResourceSelect id={id}
                                                              errors={errors}
                                                              onChange={handleOnChange}
                                                              {...props}/>
                    }
                case "dotPath":
                    return {
                        component: (props) => <DotPathAndTextInput id={id}
                                                                   errors={errors}
                                                                   onChange={handleOnChange}
                                                                   props={props}/>
                    }
                case "forceDotPath":
                    return {
                        component: (props) => <DotPathInput id={id}
                                                            errors={errors}
                                                            onChange={handleOnChange}
                                                            props={props}/>
                    }
                case "keyValueList":
                    return {
                        component: (props) => <KeyValueInput id={id}
                                                             errors={errors}
                                                             onChange={handleOnChange}
                                                             props={props}/>
                    }
                case "listOfDotPaths":
                    return {
                        component: (props) => <ListOfDotPaths
                            id={id}
                            onChange={handleOnChange}
                            errors={errors}
                            props={props}/>
                    }
                case "text":
                    return {
                        component: (props) => <TextInput id={id}
                                                         errors={errors}
                                                         onChange={handleOnChange}
                                                         {...props}/>
                    }
                case "json":
                    return {
                        component: (props) => <JsonInput id={id}
                                                         errors={errors}
                                                         onChange={handleOnChange}
                                                         {...props}/>



                    }
                case "sql":
                    return {
                        component: (props) => <SqlInput id={id}
                                                         errors={errors}
                                                         onChange={handleOnChange}
                                                         {...props}/>



                    }
                case "textarea":
                    return {
                        component: (props) => <TextAreaInput id={id}
                                                             onChange={handleOnChange}
                                                             errors={errors}
                                                             {...props}/>
                    }
                case 'select':
                    return {
                        component: (props) => <SelectInput id={id}
                                                           onChange={handleOnChange}
                                                           errors={errors}
                                                           {...props}/>
                    }

                case 'bool':
                    return {
                        component: (props) => <BoolInput id={id}
                                                         onChange={handleOnChange}
                                                         errors={errors}
                                                         {...props}/>
                    }
                case "contentInput":
                    return {
                        component: (props) => <ContentInput id={id}
                                                            onChange={handleOnChange}
                                                            errors={errors}
                                                            {...props}/>
                    }
                default:
                    return {
                        component: (props) => <AlertBox>Missing form type {componentLabel}.</AlertBox>
                    }
            }
        }

        const handleSubmit = (schema) => {
            if (onSubmit) {
                setSubmitConfirmed(false);
                setSubmitError(false);
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
                form.validate(pluginId, dot2object(currentFormValues)).then(
                    (result) => {
                        if (result === true) {
                            setErrors({})
                            // todo remove after 01.11.2021
                            // const allFields = form.getAllFields();
                            // console.log(allFields)
                            // console.log("2", currentFormValues)
                            // const fieldsToSave = objectFilter(object2dot(currentFormValues), allFields);
                            // console.log("3", currentFormValues)
                            onSubmit(dot2object(currentFormValues));
                            setSubmitConfirmed(true);
                        } else {
                            setErrors(result);
                            setSubmitError(true);
                        }
                    }
                )

            }
        }

        const groupComponents = groups.map((groupObject, idx) => {
            return <div className="JsonFromGroup" key={idx}>
                {(groupObject.name || groupObject.description) && <div className="JsonFromGroupHeader">
                    {groupObject.name && <h2>{groupObject.name}</h2>}
                    {groupObject.description && <Description text={groupObject.description}/>}
                </div>}
                <section>
                    {groupObject.fields && <Fields
                        fields={groupObject.fields}
                        componetsDb={getComponentByLabel}
                    />}
                </section>
            </div>


        })

        return <>
            {groupComponents}
            <Button onClick={() => handleSubmit(schema)}
                    confirmed={submitConfirmed}
                    error={submitError}
                    label="Save"
                    style={{marginLeft: 15}}
            />
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

    function TextInput({
                           id, label, errors = {}, onChange = () => {
        }
                       }) {

        const [value, setValue] = useState(readValue(id) || "")

        const handleChange = (event) => {
            event.preventDefault();
            setValue(event.target.value);
            formValues.current[id] = event.target.value;
            onChange(event.target.value);
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

    function BoolInput({
                           id, label, errors, onChange = () => {
        }
                       }) {
        const value = readValue(id);
        const [boolValue, setBoolValue] = useState(value || false);

        const handleChange = (value) => {
            formValues.current[id] = value;
            setBoolValue(value);
            if (onChange) {
                onChange(value);
            }
        }

        let errorProps = {}
        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <div style={{display: "flex", alignItems: "center"}}>
            <Switch
                checked={boolValue}
                onChange={() => handleChange(!boolValue)}
                name="enabledSource"
            />
            <span>{label}</span>
        </div>

    }

    function ContentInput({id, label, errors, onChange = () => {}, rows = 4}) {
        const value = readValue(id);
        const [textValue, setTextValue] = useState(value.content || "");
        const [tab, setTab] = useState(value.type === "text/plain" ? 0 : 1);

        const getContentType = (tab) => {
            switch (tab) {
                case 0:
                    return "text/plain"
                case 1:
                    return "application/json"
                case 2:
                    return "text/html"
                default:
                    return "application/json"
            }
        }

        let contentType = getContentType(tab)

        const handleTabChange = (tab) => {
            setTab(tab);
            contentType = getContentType(tab)
            handleChange(textValue)
        }

        const handleChange = (value) => {
            value = {
                type: contentType,
                content: value
            }
            formValues.current[id] = value;
            setTextValue(value.content);
            if (onChange) {
                onChange(value);
            }
        }

        let errorProps = {}
        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <Tabs
            tabs={["Text", "JSON", "HTML"]}
            defaultTab={tab}
            onTabSelect={handleTabChange}
        >
            <TabCase id={0}>
                <div style={{marginTop: 10}}>
                    <TextField id={id}
                               label={label}
                               value={textValue}
                               onChange={(ev) => handleChange(ev.target.value)}
                               variant="outlined"
                               multiline
                               fullWidth
                               rows={rows}
                               {...errorProps}/>
                </div>

            </TabCase>
            <TabCase id={1}>
                <fieldset style={{marginTop: 10}}>
                    <legend>{label}</legend>
                    <JsonEditor
                        value={textValue}
                        onChange={handleChange}
                    />
                </fieldset>
            </TabCase>
            <TabCase id={2}>
                <fieldset style={{marginTop: 10}}>
                    <legend>{label}</legend>
                    <HtmlEditor
                        value={textValue}
                        onChange={handleChange}
                    />
                </fieldset>
            </TabCase>
        </Tabs>


    }


    function SelectInput({
                             id, label, items = [], errors, onChange = () => {
        }
                         }) {
        const value = readValue(id);
        const [selectedItem, setSelectedItem] = useState(value || "");

        const handleChange = (ev) => {
            formValues.current[id] = ev.target.value;
            setSelectedItem(ev.target.value);
            if (onChange) {
                onChange(ev.target.value);
            }
            ev.preventDefault();
        }

        let errorProps = {}
        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }
        return <TextField select
                          label={label}
                          variant="outlined"
                          size="small"
                          value={selectedItem}
                          style={{minWidth: 150}}
                          onChange={handleChange}
                          {...errorProps}
        >
            {objectMap(items, (key, value) => (
                <MenuItem key={key} value={key}>
                    {value}
                </MenuItem>
            ))}
        </TextField>
    }

    function TextAreaInput({id, label, errors, onChange=null}) {

        const [value, setValue] = useState(readValue(id))

        const handleChange = (event) => {
            setValue(event.target.value);
            formValues.current[id] = event.target.value;
            event.preventDefault();
            if(onChange) {
                onChange(event.target.value);
            }
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

    function ListOfDotPaths({id, errors, props, onChange = null}) {
        const handleSubmit = (value) => {
            formValues.current[id] = value;
            if(onChange) {
                onChange(value);
            }
        }
        const value = readValue(id);

        return <ListOfDottedInputs id={id} onChange={handleSubmit} errors={errors} value={value} {...props}/>
    }

    function DotPathInput({id, errors, props, onChange = null}) {

        const handleChange = (value) => {
            formValues.current[id] = value;
            if(onChange) {
                onChange(value);
            }
        }

        const value = readValue(id);
        let errorProps = {}

        if (id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <DottedPathInput value={value}
                                forceMode={1}
                                onChange={handleChange}
                                {...errorProps}
                                {...props}/>
    }

    function DotPathAndTextInput({id, errors, props, onChange = () => {}}) {

        const handleChange = (value) => {
            formValues.current[id] = value;
            if(onChange) {
                onChange(value);
            }
        }

        const value = readValue(id);
        let errorProps = {}

        if (errors && id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <DottedPathInput value={value}
                                onChange={handleChange}
                                {...errorProps}
                                {...props}
        />
    }

    function KeyValueInput({id, errors, props, onChange = () => {}}) {

        const handleChange = (value) => {
            formValues.current[id] = value;
            if(onChange) {
                onChange(value);
            }
        }

        const value = readValue(id);
        let errorProps = {}

        if (errors && id in errors) {
            errorProps['error'] = true
            errorProps['helperText'] = errors[id]
        }

        return <KeyValueForm value={value}
                             onChange={handleChange}
                             {...errorProps}
                             {...props}
        />
    }

    function JsonInput({id, errors, onChange = null }) {

        const getFormattedValue = (value) => {
            try {
                if(typeof value === 'string' && value.length > 0) {
                    return [JSON.stringify(JSON.parse(value), null, '  '), null]
                }
                return [value, null]
            } catch(e) {
                return [value,  e.toString()]
            }
        }
        const [value, error] = getFormattedValue(readValue(id))
        const [json, setJson] = useState(value);
        const [errorMsg, setErrorMsg] = useState(error);

        const handleChange = (value) => {
            const [formattedValue, error] = getFormattedValue(value)
            setJson(value);
            setErrorMsg(error)
            formValues.current[id] = formattedValue
            if(onChange) {
                onChange(formattedValue);
            }
        }

        return <>
            <fieldset style={{marginTop: 10}}>
                <legend>JSON</legend>
                <JsonEditor
                    value={json}
                    onChange={handleChange}
                />
            </fieldset>
            <div style={{height:10}}>
                {errorMsg && <ErrorLine>{errorMsg}</ErrorLine>}
            </div>

        </>
    }

    function SqlInput({id, errors, onChange = null }) {

        const [value, setValue] = useState(readValue(id))
        console.log(value)

        const handleChange = (value) => {
            formValues.current[id] = value;
            setValue(value);
            if(onChange) {
                onChange(value);
            }
        }

        let errorMsg = ""

        if (errors && id in errors) {
            errorMsg = errors[id]
        }

        return <>
            <fieldset style={{marginTop: 10}}>
                <legend>SQL</legend>
                <SqlEditor
                    value={value}
                    onChange={handleChange}
                />
            </fieldset>
            <div style={{height:10}}>
                {errorMsg && <ErrorLine>{errorMsg}</ErrorLine>}
            </div>

        </>
    }

    function ResourceSelect({id, errors, placeholder = "Resource", onChange = () => {} }) {

        const value = readValue(id)

        const handleChange = (value) => {
            formValues.current[id] = value;
            onChange(value);
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
