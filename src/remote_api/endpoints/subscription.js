export function addSubscription(subscription) {
    return {
        url: `/subscription`,
        method: 'post',
        data: subscription
    }
}

export function getSubscriptions() {
    return {
        url: "/subscription",
        method: 'get',
    }
}

export function getSubscription(subscriptionId) {
    return {
        url: `/subscription/${subscriptionId}`,
        method: 'get',
    }
}