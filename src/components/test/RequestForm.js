import React, {useState} from "react";
import {v4 as uuid4} from "uuid";
import TuiSelectResource from "../elements/tui/TuiSelectResource";
import Input from "../elements/forms/inputs/Input";
import JsonEditor from "../elements/editors/JsonEditor";
import Button from "../elements/forms/Button";
import "./RequestForm.css";
import BoolInput from "../elements/forms/BoolInput";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import TuiColumnsFlex from "../elements/tui/TuiColumnsFlex";
import TuiTopHeaderWrapper from "../elements/tui/TuiTopHeaderWrapper";

export const RequestForm = ({onError, onRequest}) => {

    const [resource, setResource] = useState(null);
    const [session, setSession] = useState(uuid4());
    const [profile, setProfile] = useState("");
    const [eventType, setEventType] = useState('page-view');
    const [properties, setProperties] = useState(JSON.stringify({}));
    const [context, setContext] = useState(JSON.stringify({}));
    const [profileFlag, setProfileFlag] = useState(true);
    const [progress, setProgress] = useState(false);
    const [debug, setDebug] = useState(false);

    const handleSubmit = async () => {
        setProgress(true);
        try {

            if (resource === null) {
                throw new Error("Missing resource.");
            }

            const props = JSON.parse(properties);
            const ctx = JSON.parse(context);
            let requestBody = {
                context: ctx,
                session: {id: session},
                source: resource,
                events: [
                    {
                        type: eventType, properties: props
                    }
                ],
                options: {
                    profile: profileFlag,
                    debugger: debug
                }
            }

            if (profile) {
                requestBody = {...requestBody, profile: {id: profile}}
            }

            await onRequest(requestBody);

        } catch (e) {
            onError(e)
        } finally {
            setProgress(false)
        }

    }

    return <TuiForm className="RequestForm">
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Payload settings"
                description="Inside payload setting you need to define resource, session, and profile. Profile is optional an will
                    be created if nothing is passed."
            />
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <TuiColumnsFlex width={320}>
                        <TuiTopHeaderWrapper header="Session"
                                             description="If you know profile id leave session empty, then Tracardi will create new session for given profile.">
                            <Input label="Session"
                                   initValue={session}
                                   variant="outlined"
                                   onChange={(e) => setSession(e.target.value)}/>
                        </TuiTopHeaderWrapper>
                        <TuiTopHeaderWrapper header="Profile"
                                             description="Profile must match session, if you do now know profile id leave it empty, then new profile will be created for given session.">
                            <Input label="Profile"
                                   initValue={profile}
                                   variant="outlined"
                                   onChange={(e) => setProfile(e.target.value)}
                            />
                        </TuiTopHeaderWrapper>
                    </TuiColumnsFlex>
                </TuiFormGroupField>

                <TuiFormGroupField header="Options">
                    <BoolInput label="Return profile data" value={profileFlag} onChange={setProfileFlag}/>
                    <BoolInput label="Return debugger data" value={debug} onChange={setDebug}/>
                </TuiFormGroupField>

                <TuiFormGroupField header="Context" description="Context is the additional data describing event context.">
                    <fieldset>
                        <legend>Context</legend>
                        <JsonEditor value={context} onChange={setContext} height="120px"/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader
                header="Event settings"
                description="Inside event setting you need to define an event type and it properties. This data will be sent to
                    Tracardi."
            />
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <TuiColumnsFlex width={320}>
                        <TuiTopHeaderWrapper header="Source">
                            <TuiSelectResource
                                value={resource}
                                onSetValue={setResource}
                            />
                        </TuiTopHeaderWrapper>
                        <TuiTopHeaderWrapper header="Event type">
                            <Input label="Event type"
                                   initValue={eventType}
                                   style={{width: "100%"}}
                                   variant="outlined"
                                   onChange={(e) => setEventType(e.target.value)}
                            />
                        </TuiTopHeaderWrapper>
                    </TuiColumnsFlex>
                </TuiFormGroupField>

                <TuiFormGroupField header="Event properties" description="Event properties is the data data is sent to Tracardi for further processing.">
                    <fieldset>
                        <legend>Properties</legend>
                        <JsonEditor value={properties} onChange={setProperties} height="200px"/>
                    </fieldset>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <div>
            <Button label="Submit" onClick={handleSubmit} progress={progress} disabled={progress}
                    style={{justifyContent: "center"}}/>
        </div>
    </TuiForm>
}