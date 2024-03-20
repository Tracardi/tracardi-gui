export default function urlPrefix(url) {
    let _prefix = import.meta.env.PUBLIC_URL

    if(!_prefix) {
        _prefix = "/"
    }

    if(url === "" || !url) {
        return _prefix
    }

    if(_prefix === "/" && url !== "") {
        return url;
    }

    return _prefix + url
}