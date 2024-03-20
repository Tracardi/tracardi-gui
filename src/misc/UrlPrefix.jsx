export default function urlPrefix(url) {
    let _prefix = process.env.PUBLIC_URL

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