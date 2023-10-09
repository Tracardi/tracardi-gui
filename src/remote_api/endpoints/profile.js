export function getProfileById(id) {
    return {
        url: `/profile/${id}`
    }
}

export function getProfileEvents(profileId) {
    return {
        url: `/events/profile/${profileId}`
    }
}

export function getProfileSession(profileId, offset) {
    return {
        url: `/session/profile/${profileId}?n=${-offset}`
    }
}

export function getProfileLogs(profileId) {
    return {url: `/profile/logs/${profileId}?sort=desc`}
}

export function getProfilesCount() {
    return {
        url: "/profile/count"
    }
}

export function getEventsByType(profileId) {
    return {
        url: `/profile/${profileId}/by/name`
    }
}

export function getEventsByDevice(profileId) {
    return {
        url: `/profile/${profileId}/by/device.name`
    }
}

export function getEventsByDeviceType(profileId) {
    return {
        url: `/profile/${profileId}/by/device.type`
    }
}

export function getEventsByDeviceBrand(profileId) {
    return {
        url: `/profile/${profileId}/by/device.brand`
    }
}

export function getEventsByDeviceModel(profileId) {
    return {
        url: `/profile/${profileId}/by/device.model`
    }
}

export function getEventsByApp(profileId, table) {
    return {
        url: `/profile/${profileId}/by/app.name?table=${table ? 'true' : 'false'}`
    }
}

export function getProfileEventsHistogram(profileId, period) {
    return {
        method: "post",
        url: "/event/select/histogram?group_by=name",
        data: {
            "minDate": {"absolute": null, "delta": {"type": "minus", "value": -1, "entity": period}, "now": null},
            "maxDate": {"absolute": null, "delta": null, "now": null},
            "where": `profile.id="${profileId}"`,
            "limit": 100,
            "random": Math.random()
        }
    }
}