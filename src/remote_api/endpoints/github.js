export function saveWorkflowInGitHub(id, fileName, message) {
    return {
        url: "/github/workflow/" + id,
        method: "post",
        data: {
            file_name: fileName,
            message
        }
    }
}

export function listGitHubFiles(path=null) {
    return {
        url: path ? "/github/list?path=" + path : "/github/list",
        method: "get"
    }
}

export function loadGitHubFile(path=null) {
    return {
        url: "/github/load?path="+path,
        method: "get"
    }
}