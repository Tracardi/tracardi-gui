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