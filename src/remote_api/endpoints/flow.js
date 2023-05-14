export function getFlowDebug(eventId) {
    if(!eventId) {
        return {
            url: "/flow/debug",
            method: "POST"
        }
    }
    return {
        url: "/flow/debug?event_id="+eventId,
        method: "POST"
    }

}