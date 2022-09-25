import {asyncRemote} from "./entrypoint";

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

    const params = {
        username: username,
        password: password
    };

    return asyncRemote({
        url: "/user/token",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        method: "post",
        data: JsonToURLEncoded(params)
    });

};