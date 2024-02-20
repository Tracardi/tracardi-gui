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

export function computeAudienceById(audienceId) {
    return {
        url: `/audience/compute/${audienceId}`,
        method: 'get',
    }
}


export function computeAudience(audience) {
    return {
        url: "/audience/compute",
        method: 'post',
        data: audience
    }
}