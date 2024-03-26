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

export function getEventsByTag() {
    return {
        url: "/events/by_tag"
    }
}

export function getEventsByType() {
    return {
        url: "/events/by_type"
    }
}

export function getEventsByStatus() {
    return {
        url: "/events/by_status"
    }
}

export function getEventsBySource() {
    return {
        url: "/events/by_source"
    }
}

export function getEventsByOsName() {
    return {
        url: "/events/by_os_name"
    }
}

export function getEventsByDeviceGeo() {
    return {
        url: "/events/by_device_geo"
    }
}

export function getEventsByChannel() {
    return {
        url: "/events/by_channel"
    }
}

export function getEventsByResolution() {
    return {
        url: "/events/by_resolution"
    }
}

export function getEvents(query, page = 0, limit = 30) {
    return {
        url: '/event/select/range',
        method: "post",
        data: query || "",
        limit: limit,
        page: page
    }
}

export function getEventHistogram(query, page = 0, limit = 30) {
    return {
        url: '/event/select/histogram?group_by=metadata.status',
        method: "post",
        data: query,
        limit: limit,
        page: page
    }
}

export function getTopEvents() {
    return {
        url: '/event/select/range/page/0',
        method: "post",
        data: {
            minDate: {"absolute": null, "delta": {"type": "minus", "value": -29, "entity": "day"}},
            maxDate: {"absolute": null, "delta": null},
            where: "",
            limit: 10,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            rand: Math.random().toString()
        }
    }
}