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
    return { url: "/event/count" }
}

export function getEventsAvg() {
    return { url: "/event/avg/requests" }
}


export function getEventsToProfileCopy(settings) {
    return {
        url: "/events/copy",
        method: "post",
        data: settings
    }
}

export function getEventsToProfileAffectedRecords(query) {
    return {
        url: `/events/count_by_query?query=${query}`
    }
}
