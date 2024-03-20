export function getTest(testId) {
    return {
        url: `/test/${testId}`,
        method: 'get',
    }
}

export function addTest(test) {
    return {
        url: `/test`,
        method: 'post',
        data: test
    }
}