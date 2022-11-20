import axios from "axios";
import {v4 as uuid4} from 'uuid';
import storageValue from "../misc/localStorageDriver";

function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
        let date = new Date();
        date.setTime(date.getTime() + (hours*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export const track = async (sourceId, eventType, properties) => {

    const profile = new storageValue("tracardi-profile-id")
    const cookie = getCookie("tracardi-session-id")

    const event = {
        "type": eventType,
        "properties": properties
    }

    const profileId = profile.read(null)
    const sessionId = cookie || uuid4()

    let payload = {
        source: {
            id: sourceId
        },
        session: {
            id: sessionId
        },
        context: {},
        properties: {},
        events: [
            event
        ],
        options: {
            storage: true
        }
    }

    if(profileId !== null) {
        payload.profile = {
            id: profileId
        }
    }

    return axios({
        baseURL: "//track.tracardi.com",
        url: "/track",
        method: "post",
        data: payload,
        timeout: 1000 * 60  // 10s
    }).then(
        (response) => {
            if(response.data) {
                new storageValue("tracardi-profile-id").save(response.data.profile.id)
                setCookie("tracardi-session-id", sessionId, 0)
            }
        }
    ).catch(e => {
        console.log(e)
    })
}