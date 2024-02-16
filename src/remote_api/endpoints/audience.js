export function addAudience(audience) {
    return {
        url: `/audience`,
        method: 'post',
        data: audience
    }
}

export function getAudiences() {
    return {
        url: "/audience",
        method: 'get',
    }
}

export function getAudience(audienceId) {
    return {
        url: `/audience/${audienceId}`,
        method: 'get',
    }
}