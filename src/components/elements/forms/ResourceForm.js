import React, {useEffect, useState} from "react";
import Button from "./Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import {v4 as uuid4} from 'uuid';
import JsonEditor from "../editors/JsonEditor";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import {TuiSelectResourceTypeMemo} from "../tui/TuiSelectResourceType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DisabledInput from "./inputs/DisabledInput";
import Tabs, {TabCase} from "../tabs/Tabs";
import TuiTagger from "../tui/TuiTagger";
import TuiTags from "../tui/TuiTags";
import MdManual from "../../flow/actions/MdManual";


function ResourceForm({init, onClose, showAlert}) {

    const inEditMode = !init;

    if (!init) {
        init = {
            id: uuid4(),
            name: "",
            type: null,
            description: "",
            credentials: {
                production: {},
                test: {}
            },
            enabled: true,
            tags: [],
            groups: [],
            destination: {
                package: null,
                init: {},
                form: {}
            },
            icon: null
        }
    }

    const [enabledSource, setEnabledSource] = useState(init?.enabled);
    const [type, setType] = useState(null);  // It is set in useEffects after the types are loaded
    const [name, setName] = useState(init?.name);
    const [id, setId] = useState(init?.id);
    const [tags, setTags] = useState(init?.tags);
    const [groups, setGroups] = useState(init?.groups);
    const [icon, setIcon] = useState(init?.icon);
    const [destination, setDestination] = useState(init?.destination);
    const [description, setDescription] = useState(init?.description);
    const [errorTypeMessage, setTypeErrorMessage] = useState('');
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [productionConfig, setProductionConfig] = useState(JSON.stringify(init?.credentials?.production, null, '  '));
    const [testConfig, setTestConfig] = useState(JSON.stringify(init?.credentials?.test, null, '  '));
    const [processing, setProcessing] = useState(false);
    const [credentialTypes, setCredentialTypes] = useState({});
    const [selectedTab, setSelectedTab] = useState(0);
    const [docPath, setDocPath] = useState(null);

    const getIdNameFromType = (type, types) => {
        if (type in types) {
            return {id: type, name: types[type].name}
        }
        return {id: type, name: type}
    }

    const getDocPathFromType = (type, types) => {
        if (type in types) {
            return types[type]?.manual || null;
        } else return null;
    }

    useEffect(() => {

        request(
            {url: "/resources/type/configuration"},
            () => {
            },
            () => {
            },
            (response) => {
                if (response) {
                    setCredentialTypes(response.data.result);
                    // Original type value is an id  e.g "aws", but "type" state is and object with id and name,
                    // e.g {name" "AWS credentials", id: "aws"}
                    // It must be set after the available list of resources are loaded.
                    setType(getIdNameFromType(init?.type, response.data.result));
                    setDocPath(getDocPathFromType(init?.type, response.data.result));
                }
            }
        )
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [])  // setting init here make infinite request

    const onSubmit = (payload) => {
        setProcessing(true);
        request({
                url: "/resource",
                method: "post",
                data: payload
            },
            setProcessing,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 5000});
                }
            },
            (data) => {
                if (data) {
                    request({
                            url: '/resources/refresh'
                        },
                        setProcessing,
                        () => {
                        },
                        () => {
                            if (onClose) {
                                onClose(data)
                            }
                        }
                    )
                }
            }
        )
    }

    const setTypeAndDefineCredentialsTemplate = (type) => {
        setType(type)
        if (type?.id in credentialTypes) {
            const template = credentialTypes[type?.id];
            setProductionConfig(JSON.stringify(template?.config, null, '  '));
            setTestConfig(JSON.stringify(template?.config, null, '  '));
            setTags(template?.tags);
            setDestination(template?.destination);
            setIcon(template?.icon);
            setDocPath(template?.manual);
        }
    }

    const handleSubmit = () => {

        if (!name || name.length === 0 || !type?.name) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if (!type?.name) {
                setTypeErrorMessage("Source type can not be empty");
            } else {
                setTypeErrorMessage("");
            }
            return;
        }

        try {
            const payload = {
                id: (!id) ? uuid4() : id,
                name: name,
                description: description,
                type: type.id,  // Save only type id not the whole object.
                credentials: {
                    production: (productionConfig === "") ? {} : JSON.parse(productionConfig),
                    test: (testConfig === "") ? {} : JSON.parse(testConfig)
                },
                destination: destination,
                icon: icon,
                enabled: enabledSource,
                tags: tags,
                groups: groups
            };
            onSubmit(payload)
        } catch (e) {
            alert("Invalid JSON in field CONFIG.")
        }
    }

    const handleTabSelect = (tab) => {
        setSelectedTab(tab);
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Resource"/>
            <TuiFormGroupContent>
                {inEditMode && <><TuiFormGroupField header="Resource id"
                                                    description="Resource id is auto-generated. In most cases you do not have to do nothing
                                   just leave it like it is. In rare cases when you would like to create a resource
                                   with user defined value, then unlock the field and type your resource id. If you change
                                   the id of existing resource new resource will be created.">
                    <DisabledInput label={"Resource id"}
                                   value={id}
                                   onChange={setId}/>
                </TuiFormGroupField>
                    <TuiFormGroupField header="Resource type"
                                       description="Resource type defines storage or endpoint type. If any resource type
                                       is missing check 'Resource/Premium Services' for more resources.">
                        <TuiSelectResourceTypeMemo value={type}
                                                   onSetValue={setTypeAndDefineCredentialsTemplate}
                                                   errorMessage={errorTypeMessage}/>
                    </TuiFormGroupField></>}
                <TuiFormGroupField header="Name" description="Resource name can be any string that
                    identifies resource.">
                    <TextField
                        label={"Resource name"}
                        value={name}
                        error={(typeof errorNameMessage !== "undefined" && errorNameMessage !== '' && errorNameMessage !== null)}
                        helperText={errorNameMessage}
                        onChange={(ev) => {
                            setName(ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you understand what kind of resource it is.">
                    <TextField
                        label={"Resource description"}
                        value={description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setDescription(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Grouping"
                                   description="Resources can be grouped with tags that are typed here.">
                    <TuiTagger tags={groups} onChange={setGroups}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="System tags" description="System tags are auto-tagged. This is only information on
                resource type. It is used internally by the system.">
                    <TuiTags tags={tags}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Enabled" description="If you want to be able to use this resource, then you need to enable it before."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabledSource}
                            onChange={() => setEnabledSource(!enabledSource)}
                            name="enabledSource"
                        />
                        <span>
                        This resource is enabled
                    </span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Credentials or Access tokens" description="This json data will be an
                encrypted part of resource. Please pass here all the credentials or access configuration information,
                such as hostname, port, username and password, etc.">
                </TuiFormGroupField>
                <Tabs
                    tabs={["Test", "Production"]}
                    defaultTab={selectedTab}
                    onTabSelect={handleTabSelect}
                >
                    <TabCase id={0}>
                        <fieldset style={{marginTop: 10}}>
                            <legend>Credentials configuration</legend>
                            <JsonEditor value={testConfig} onChange={setTestConfig}/>
                        </fieldset>
                    </TabCase>
                    <TabCase id={1}>
                        <fieldset style={{marginTop: 10}}>
                            <legend>Credentials configuration</legend>
                            <JsonEditor value={productionConfig} onChange={setProductionConfig}/>
                        </fieldset>
                    </TabCase>

                </Tabs>

            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save"
                onClick={handleSubmit}
                progress={processing}
                style={{justifyContent: "center", width: "100%"}}
        />
        {docPath && 
            <TuiFormGroup style={{marginTop: 20}}>
                <TuiFormGroupHeader header="Resource configuration help"/>
                <TuiFormGroupContent>
                    <MdManual mdFile={docPath} basePath="/manual/en/docs/resources/" />
                </TuiFormGroupContent>
            </TuiFormGroup>
        }
    </TuiForm>
}

ResourceForm.propTypes = {
    init: PropTypes.object,
    onClose: PropTypes.func
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(ResourceForm)