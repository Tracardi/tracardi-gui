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