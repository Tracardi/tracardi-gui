export default class storageValue {

    constructor(key) {
        this.key = key;
    }

    read(defaultValue=null) {
        try {
            const item = localStorage.getItem(this.key);
            return item === null ? defaultValue : JSON.parse(item);
        } catch (error) {
            return defaultValue
        }
    }

    save(data, defaultValue=null) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            localStorage.setItem(this.key, defaultValue)
        }
    }

    remove() {
        localStorage.removeItem(this.key)
    }
}