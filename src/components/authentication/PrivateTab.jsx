export default class PrivateTab {

    constructor(roles, component, path, label, hash) {
        this.roles = roles;
        this.component = component;
        this.path = path;
        this.label = label;
        this.hash = hash;
    }

    intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    isAuth(roles) {
        if(this.intersect(roles, this.roles).length > 0) {
            return true
        }
        return false
    }

}