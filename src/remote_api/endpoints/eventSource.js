export function getEventSources(query=null) {
    return {
        url: '/event-sources' + ((query) ? "?query=" + query : ""),
        method: "get"
    }
}