export function addActivation(activation) {
    return {
        url: `/activation`,
        method: 'post',
        data: activation
    }
}

export function getActivations() {
    return {
        url: "/activation",
        method: 'get',
    }
}

export function getActivation(activationId) {
    return {
        url: `/activation/${activationId}`,
        method: 'get',
    }
}