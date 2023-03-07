import storageValue from "./misc/localStorageDriver";

export const commercial = true;
export const contextKey ='.tr-data-production-context'
export const localContextKey = '.tr-local-analytics-context'
export function getDataContext(defaultValue) {return new storageValue(contextKey).read(defaultValue)}
export function setDataContext(value) {return new storageValue(contextKey).save(value)}
export function getDataContextHeader() {return new storageValue(contextKey).read(false) ? "production": "staging"}

export function getLocalContext(key, defaultValue) {return new storageValue(key).read(defaultValue)}
export function setLocalContext(key, value) {return new storageValue(key).save(value)}
export function getLocalContextHeader(key) {return new storageValue(key).read(false) ? "production": "staging"}