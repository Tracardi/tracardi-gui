import storageValue from "./misc/localStorageDriver";

export const contextKey ='.tr-data-production-context'
export function getDataContext(defaultValue) {return new storageValue(contextKey).read(defaultValue)}
export function setDataContext(value) {return new storageValue(contextKey).save(value)}
export function getDataContextHeader() {return new storageValue(contextKey).read(false) ? "production (production settings and data displayed)": "sand-box (test settings and data displayed)"}
