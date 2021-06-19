import {api} from "./entrypoint";

function JsonToURLEncoded(element, key, list) {
    list = list || [];
    if (typeof (element) == 'object') {
        for (let idx in element)
            JsonToURLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
    } else {
        list.push(key + '=' + encodeURIComponent(element));
    }
    return list.join('&');
}

export const loginUser = (username, password) => {

    const path = "/token";
    const params = {
        username: username,
        password: password
    };

    return api({"Content-Type": "application/x-www-form-urlencoded"})
        .post(path, JsonToURLEncoded(params));

};