import React, {useState} from "react";
import {v4 as uuid4} from "uuid";
import ResourceSelect from "../elements/forms/ResourceSelect";
import Input from "../elements/forms/inputs/Input";
import JsonEditor from "../elements/editors/JsonEditor";
import Button from "../elements/forms/Button";
import "./RequestForm.css";
import BoolInput from "../elements/forms/BoolInput";

export const RequestForm = ({onError, onRequest}) => {

    const [resource, setResource] = useState(null);
    const [session, setSession] = useState(uuid4());
    const [profile, setProfile] = useState(null);
    const [eventType, setEventType] = useState('page-view');
    const [properties, setProperties] = useState(JSON.stringify({}));
    const [context, setContext] = useState(JSON.stringify({}));
    const [profileFlag, setProfileFlag] = useState(true);
    const [progress, setProgress] = useState(false);

    const handleSubmit = async () => {
        setProgress(true);
        try {

            if(resource===null) {
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
                    profile: profileFlag
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

    const handleProfileFlag = (value) => {
        setProfileFlag(value);
    }

    return <form className="JsonForm RequestForm">
        <div className="JsonFromGroup RequestFormGroup">
            <div className="JsonFromGroupHeader">
                <h2>Payload settings</h2>
                <p>Inside payload setting you need to define resource, session, and profile. Profile is optional an will
                    be created if nothing is passed.</p>
            </div>
            <section style={{overflowY: "auto"}}>
                <div style={{display: "flex", gap: 20, flexWrap: "wrap"}}>
                    <div style={{flexBasis: 320}}>
                        <div style={{display: "flex", gap: 10, flexDirection: "column"}}>
                            <div>
                                <h3>Session</h3>
                                <p style={{height: 60, textOverflow: "ellipsis", overflow: "hidden"}}>If you know
                                    profile id leave session empty, then Tracardi will create new session for given
                                    profile.</p>
                            </div>
                            <div>
                                <Input label="Session"
                                       initValue={session}
                                       variant="outlined"
                                       onChange={(e) => setSession(e.target.value)}/>
                            </div>
                        </div>

                    </div>
                    <div style={{flexBasis: 320}}>
                        <div style={{display: "flex", gap: 10, flexDirection: "column"}}>
                                <div>
                                    <h3>Profile</h3>
                                    <p style={{height: 60, textOverflow: "ellipsis", overflow: "hidden"}}>Profile must
                                        match session, if you do now know profile id leave it empty, then new profile will
                                        be created for given session.</p>
                                </div>
                                <div>
                                    <Input label="Profile"
                                           initValue={profile}
                                           variant="outlined"
                                           onChange={(e) => setProfile(e.target.value)}
                                    />
                                </div>
                            </div>
                    </div>
                </div>

                <h3>Options</h3>
                <BoolInput label="Return profile data" value={profileFlag} onChange={handleProfileFlag}/>

                <h3>Context</h3>
                <p>Context is the additional data describing event context.</p>
                <fieldset>
                    <legend>Context</legend>
                    <JsonEditor value={context} onChange={setContext} height={120}/>
                </fieldset>
            </section>
        </div>
        <div className="JsonFromGroup RequestFormGroup">
            <div className="JsonFromGroupHeader">
                <h2>Event settings</h2>
                <p>Inside event setting you need to define an event type and it properties. This data will be sent to
                    Tracardi. </p>
            </div>

            <section style={{overflowY: "auto"}}>
                <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                    <div  style={{flexBasis: 320}}>
                        <h3>Source</h3>
                        <ResourceSelect
                            value={resource}
                            onChange={setResource}
                        />
                    </div>
                    <div  style={{flexBasis: 320}}>
                        <h3>Event type</h3>
                        <Input label="Event type"
                               initValue={eventType}
                               style={{width: "100%"}}
                               variant="outlined"
                               onChange={(e) => setEventType(e.target.value)}
                        />
                    </div>

                </div>

                <h3>Event properties</h3>
                <p>Event properties is the data data is sent to Tracardi for further processing.</p>
                <fieldset>
                    <legend>Properties</legend>
                    <JsonEditor value={properties} onChange={setProperties} height={200}/>
                </fieldset>
            </section>

        </div>
        <div>
            <Button label="Submit" onClick={handleSubmit} progress={progress} disabled={progress} style={{justifyContent: "center"}}/>
        </div>
    </form>
}