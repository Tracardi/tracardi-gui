import React, {useState} from "react";
import {v4 as uuid4} from "uuid";
import {remote} from "../../remote_api/entrypoint";
import ResourceSelect from "../elements/forms/ResourceSelect";
import Input from "../elements/forms/inputs/Input";
import JsonEditor from "../elements/editors/JsonEditor";
import Button from "../elements/forms/Button";

export const RequestForm = ({onResponse, onRequest}) => {

    const [resource, setResource] = useState(null);
    const [session, setSession] = useState(uuid4());
    const [profile, setProfile] = useState(null);
    const [eventType, setEventType] = useState('page-view');
    const [properties, setProperties] = useState(JSON.stringify({}));
    const [context, setContext] = useState(JSON.stringify({}));
    const [profileFlag, setProfileFlag] = useState(true);

    const handleSubmit = async () => {

        try {
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

            onRequest(requestBody);

            try {
                const resp = await remote({
                        url: '/track',
                        method: 'post',
                        data: requestBody
                    }
                );
                if (resp) {
                    onResponse(resp.data)
                    console.log(resp)
                }
            } catch (e) {
                console.log(e)
                onResponse({})
            }

        } catch (e) {
            onResponse({})
        }


    }

    return <form className="JsonForm">
        <div className="JsonFromGroup">
            <div className="JsonFromGroupHeader">
                <h2>Payload settings</h2>
            </div>
            <section>
                <h3>Input Resource </h3>
                <ResourceSelect
                    value={resource}
                    onChange={setResource}
                />
                <h3>Session</h3>
                <Input label="Session"
                       initValue={session}
                       variant="outlined"
                       onChange={(e) => setSession(e.target.value)}
                />
                <h3>Profile</h3>
                <Input label="Profile"
                       initValue={profile}
                       variant="outlined"
                       onChange={(e) => setProfile(e.target.value)}
                />
                <h3>Context</h3>
                <p>EContext is the additional data describing event context.</p>
                <JsonEditor value={context} onChange={setContext} height={200}/>
            </section>
        </div>
        <div className="JsonFromGroup">
            <div className="JsonFromGroupHeader">
                <h2>Payload settings</h2>
            </div>
            <section>
                <h3>Event type</h3>
                <Input label="Event type"
                       initValue={eventType}
                       style={{width: "100%"}}
                       variant="outlined"
                       onChange={(e) => setEventType(e.target.value)}
                />
                <h3>Event properties</h3>
                <p>Event properties is the data data is sent to Tracardi for further processing.</p>
                <JsonEditor value={properties} onChange={setProperties}/>
            </section>
        </div>

        <Button label="Sumbit" onClick={handleSubmit}/>
    </form>
}