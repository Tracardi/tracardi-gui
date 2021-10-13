import dot from "dot-object";

export function object2dot(data) {
    return typeof data !== "undefined" && data !== null ? dot.dot(data) : {};
}

export function dot2object(data) {
    return dot.object(data)
}
