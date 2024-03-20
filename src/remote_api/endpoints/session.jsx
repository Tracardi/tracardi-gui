export function getSessionById(id) {
    return {
        url: `/session/${id}`
    }
}

export function getSessionEvents(sessionId, profileId, limit) {
    return {
        url: `/events/session/${sessionId}/profile/${profileId}?limit=${limit}`
    }
}

export function getOnlineSessions() {
    return {
        url: '/session/count/online'
    }
}

export function getOnlineSessionsByLocation() {
    return {
        url: '/session/count/online/by_location'
    }
}


export function  getSessionsByApp() {
    return {
        url: "/sessions/count/by_app"
    }
}

export function getSessionsByOsName() {
    return {
        url: "/sessions/count/by_os_name"
    }
}

export function getSessionsByDeviceGeo() {
    return {
        url: "/sessions/count/by_device_geo"
    }
}

export function getSessionsByChannel() {
    return {
        url: "/sessions/count/by_channel"
    }
}

export function getSessionsByResolution() {
    return {
        url: "/sessions/count/by_resolution"
    }
}