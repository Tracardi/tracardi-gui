export function getDestinations(query=null) {
    return {
        url: '/destinations/by_tag' + ((query) ? "?query=" + query : ""),
        method: "get"
    }
}