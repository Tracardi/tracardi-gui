export default class storageValue {
    constructor(key) {
        this.key = key;
    }

    read(defaultValue=null) {
        try {
            const endpoint = localStorage.getItem(this.key);
            return endpoint === null ? null : JSON.parse(endpoint);
        } catch (error) {
            localStorage.setItem(this.key, defaultValue)
            console.error(error);
        }
    }

    save(data, defaultValue=null) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            console.error(error);
            localStorage.setItem(this.key, defaultValue)
        }
    }
}