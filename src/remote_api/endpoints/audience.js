export function addAudience(audience) {
    return {
        url: `/audience`,
        method: 'post',
        data: audience
    }
}