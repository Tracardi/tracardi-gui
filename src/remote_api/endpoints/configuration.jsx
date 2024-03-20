export function addConfiguration(configuration) {
    return {
        url: `/configuration`,
        method: 'post',
        data: configuration
    }
}

export function getConfigurations() {
    return {
        url: "/configuration",
        method: 'get',
    }
}

export function getConfiguration(configurationId) {
    return {
        url: `/configuration/${configurationId}`,
        method: 'get',
    }
}