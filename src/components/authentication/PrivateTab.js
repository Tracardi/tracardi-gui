import {getRoles} from "./login";

export default class PrivateTab {
    constructor(roles, component, path, label) {
        this.roles = roles;
        this.component = component;
        this.path = path;
        this.label = label;
    }

    intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    isAuth() {
        if(this.intersect(getRoles(), this.roles).length > 0) {
            return true
        }
        return false
    }

}