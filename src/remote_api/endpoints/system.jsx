export function getSystemInfo() {
    return {url: "/info/version"}
}

export function getInstallStatus() {
    return {
        url: "/install",
    }
}

export function getBuildInEventType(id) {
    return {
        url: `/event-type/build-in/${id}`,
    }
}

export function getSystemSettings() {
    return {
        method: "get",
        url: `/system/settings`,
    }
}