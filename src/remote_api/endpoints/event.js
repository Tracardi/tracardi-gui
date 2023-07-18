export function getEventById(id) {
    return {
        url: "/event/" + id
    }
}

export function getEventsAndSources() {
    return {
        url: "/events/by-type/by-source"
    }
}

export function getEventLogs(eventId) {
    return {
        url: `/event/logs/${eventId}?sort=desc`,
    }
}

export function getEventDebugLogs(eventId) {
    return {url: `/event/debug/${eventId}`}
}

export function getEventsCount() {
    return {url: "/event/count"}
}

export function getEventsAvg() {
    return {url: "/event/avg/requests"}
}

export function getEventsToProfileCopy(settings) {
    return {
        url: "/events/copy",
        method: "post",
        data: settings
    }
}

export function getEventsIndexingCopy(settings) {
    return {
        url: "/events/index",
        method: "post",
        data: settings
    }
}

export function getEventsTotalRecords(query) {
    return {
        url: `/events/copy/count_by_query?query=${query}`
    }
}


export function getEventTypePredefinedProps(eventType) {
    return {
        url: `/event/type/${eventType}/schema`
    }
}

export function getEventByTypeAgg() {
    return {
        url: "/events/by_type"
    }
}

export function getEventByOsName() {
    return {
        url: "/events/by_os_name"
    }
}

export function getEventByDeviceGeo() {
    return {
        url: "/events/by_device_geo"
    }
}

export function getEventByChannel() {
    return {
        url: "/events/by_channel"
    }
}

export function getEventByResolution() {
    return {
        url: "/events/by_resolution"
    }
}