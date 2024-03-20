import dot from "dot-object";

export function object2dot(data, keepArrays=false) {
    dot.keepArray = keepArrays;
    return typeof data !== "undefined" && data !== null ? dot.dot(data) : {};
}

export function dot2object(data) {
    return dot.object(data)
}
