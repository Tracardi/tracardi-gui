export function getProfileCacheTTL(id) {
    return {
        url: "/cache/profile/expire?profile_id="+id,
        method: 'get',
    }
}
