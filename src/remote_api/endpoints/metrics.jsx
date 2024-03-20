export function setMetrics(payload) {
    return {
        url: '/setting/metric',
        method: 'post',
        data: payload
    }
}

export function getMetricById(id) {
    return {
        url: "/setting/metric/" + id
    }
}

export function testProfileMetric(payload) {
    return {
        url: "/metric/profile/test",
        method: "POST",
        data: payload
    }
}